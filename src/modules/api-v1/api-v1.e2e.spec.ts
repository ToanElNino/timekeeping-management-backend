// ```yarn test -- src/modules/api-v1/api-v1.e2e.spec.ts --verbose``` to run test

import {Test, TestingModule} from '@nestjs/testing';
import {ExecutionContext, HttpStatus, INestApplication} from '@nestjs/common';
import request from 'supertest';
import {ApiV1Controller} from './api-v1.controller';
import {ApiV1Service} from './api-v1.service';
import {AdminService} from '../admin/admin.service';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';

describe('ApiV1Controller', () => {
  let app: INestApplication;
  let apiV1Service: ApiV1Service;
  let adminService: AdminService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ApiV1Controller],
      providers: [
        {
          provide: ApiV1Service,
          useValue: {
            createApiKey: jest.fn(),
            getListApi: jest.fn(),
            detail: jest.fn(),
            updateStatus: jest.fn(),
          },
        },
        {
          provide: AdminService,
          useValue: {
            isActive: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = {id: 1};
          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    apiV1Service = moduleFixture.get<ApiV1Service>(ApiV1Service);
    adminService = moduleFixture.get<AdminService>(AdminService);
  });

  describe('POST /api-keys', () => {
    it('should create a new api key', async () => {
      const apiData = {
        id: 1,
        apiKey: '0be6703d8eb931d53a27',
        status: 'ACTIVE',
        createdAt: 123456789,
        updatedAt: 123456789,
      };
      jest.spyOn(adminService, 'isActive').mockResolvedValueOnce(true);
      jest
        .spyOn(apiV1Service, 'createApiKey')
        .mockResolvedValueOnce(apiData as any);
      const response = await request(app.getHttpServer())
        .post('/api-keys')
        .expect(HttpStatus.CREATED);
      expect(response.body).toEqual(apiData);
    });

    it('should return 403 if user does not have permission', async () => {
      jest.spyOn(adminService, 'isActive').mockResolvedValueOnce(false);

      await request(app.getHttpServer())
        .post('/api-keys')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('GET /api-keys', () => {
    it('should return a list of api keys', async () => {
      const data = [
        {
          id: 1,
          apiKey: '0be6703d8eb931d53a27',
          status: 'ACTIVE',
          createdAt: 123456789,
          updatedAt: 123456789,
        },
        {
          id: 2,
          apiKey: '0be6703d8eb931d53a27',
          status: 'ACTIVE',
          createdAt: 123456789,
          updatedAt: 123456789,
        },
      ];
      jest.spyOn(adminService, 'isActive').mockResolvedValueOnce(true);
      jest.spyOn(apiV1Service, 'getListApi').mockResolvedValueOnce({
        results: data,
        pagination: {
          currentPage: 1,
          itemCount: 2,
          itemsPerPage: 10,
          totalItems: 2,
          totalPages: 1,
        },
      } as any);

      const response = await request(app.getHttpServer())
        .get('/api-keys')
        .expect(HttpStatus.OK);

      expect(response.body).toEqual({
        results: data,
        pagination: {
          currentPage: 1,
          itemCount: 2,
          itemsPerPage: 10,
          totalItems: 2,
          totalPages: 1,
        },
      });
    });

    it('should return 403 if user does not have permission', async () => {
      jest.spyOn(adminService, 'isActive').mockResolvedValueOnce(false);
      await request(app.getHttpServer())
        .get('/api-keys')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('GET /api-keys/:id', () => {
    it('should return api key detail', async () => {
      jest.spyOn(adminService, 'isActive').mockResolvedValueOnce(true);
      jest.spyOn(apiV1Service, 'detail').mockResolvedValueOnce({
        id: 1,
        apiKey: '0be6703d8eb931d53a27',
        status: 'ACTIVE',
        createdAt: 123456789,
        updatedAt: 123456789,
      });

      const response = await request(app.getHttpServer())
        .get('/api-keys/1')
        .expect(HttpStatus.OK);

      expect(response.body).toEqual({
        id: 1,
        apiKey: '0be6703d8eb931d53a27',
        status: 'ACTIVE',
        createdAt: 123456789,
        updatedAt: 123456789,
      });
    });

    it('should return 403 if user does not have permission', async () => {
      jest.spyOn(adminService, 'isActive').mockResolvedValueOnce(false);
      await request(app.getHttpServer())
        .get('/api-keys/1')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('PUT /api-keys/:id/change-status', () => {
    it('should update api key status', async () => {
      jest.spyOn(apiV1Service, 'updateStatus').mockResolvedValueOnce({
        id: 1,
        apiKey: '0be6703d8eb931d53a27',
        status: 'ACTIVE',
        createdAt: 123456789,
        updatedAt: 123456789,
      });

      const response = await request(app.getHttpServer())
        .put('/api-keys/1/change-status')
        .send({status: 'ACTIVE'})
        .expect(HttpStatus.OK);

      expect(response.body).toEqual({
        id: 1,
        apiKey: '0be6703d8eb931d53a27',
        status: 'ACTIVE',
        createdAt: 123456789,
        updatedAt: 123456789,
      });
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
