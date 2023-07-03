// ```yarn test -- src/modules/admin/admin.e2e.spec.ts --verbose``` to run test

import {Test, TestingModule} from '@nestjs/testing';
import {ExecutionContext, HttpStatus, INestApplication} from '@nestjs/common';
import request from 'supertest';
import {JwtService} from '@nestjs/jwt';
import {AdminService} from './admin.service';
import {PaginationResponse} from '../../config/rest/paginationResponse';
import {Admin} from '../../database/entities';
import {UpdateStatus} from './request/update-status.dto';
import {UpdateAdminPassword} from './request/update-password.dto';
import {Causes} from '../../config/exception/causes';
import {CreatePartnership} from './request/createPartnership.dto';
import {AdminController} from './admin.controller';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';
import {Repository} from 'typeorm';
import {AdminRepository} from './admin.repository';
import {MailService} from '../mail/mail.service';
import {getRepositoryToken} from '@nestjs/typeorm';
import {AuthService} from '../auth/auth.service';

describe('AdminController (e2e)', () => {
  let app: INestApplication;
  let adminService: AdminService;
  let jwtService: JwtService;

  const mockAdmin = {
    id: 1,
    fullName: '',
    username: 'test',
    email: 'test@test.com',
    password: 'password',
    status: 'ACTIVE',
    type: 1,
    code: 'code',
    avatarUrl: '',
    clientId: 0,
    createdAt: 123456789,
    updatedAt: 123456789,
  };

  const mockCreatePartnership: CreatePartnership = {
    email: 'example@gmail.com',
    username: 'username',
    fullName: 'full_name',
    password: 'password',
    type: 1,
  };

  const mockUpdateStatus: UpdateStatus = {
    status: 'INACTIVE',
    reason: 'mock reason',
  };

  const mockUpdateAdminPassword: UpdateAdminPassword = {
    oldPassword: 'password',
    newPassword: 'newpassword',
  };

  const mockRequestWithUser = {
    user: mockAdmin,
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        JwtService,
        AdminRepository,
        {
          provide: getRepositoryToken(Admin),
          useClass: Repository,
        },
        {
          provide: AdminService,
          useValue: {
            getList: jest.fn(),
            checkPermissionUser: jest.fn(),
            createPartnership: jest.fn(),
            checkDuplicatedUser: jest.fn(),
            updateStatus: jest.fn(),
            getUserById: jest.fn(),
          },
        },
        {
          provide: MailService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
        {provide: AuthService, useValue: {}},
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate(context: ExecutionContext) {
          const req = context.switchToHttp().getRequest();
          req.user = {id: 1};
          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    adminService = app.get<AdminService>(AdminService);
    jwtService = app.get<JwtService>(JwtService);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /admin', () => {
    it('should return a list of admins', async () => {
      const pagination = {
        totalItems: 1,
        itemCount: 1,
        itemsPerPage: 10,
        totalPages: 1,
        currentPage: 1,
      };
      jest.spyOn(adminService, 'checkPermissionUser').mockResolvedValue(true);
      jest.spyOn(adminService, 'getList').mockResolvedValue({
        pagination: pagination,
        results: [mockAdmin],
      } as any);
      const response = await request(app.getHttpServer())
        .get('/admin')
        .expect(HttpStatus.OK);
      const body: PaginationResponse<Admin> = response.body;
      expect(body.results).toMatchObject([mockAdmin]);
      expect(body.pagination).toMatchObject(pagination);
    });
    it('should throw an exception if user does not have permission', async () => {
      jest.spyOn(adminService, 'checkPermissionUser').mockResolvedValue(false);
      const response = await request(app.getHttpServer())
        .get('/admin')
        .expect(HttpStatus.UNAUTHORIZED);
      expect(response.body.message).toEqual(
        Causes.USER_DONT_HAVE_PERMISSION.message
      );
    });
  });

  describe('POST /admin', () => {
    it('should create a new partnership', async () => {
      jest.spyOn(adminService, 'checkPermissionUser').mockResolvedValue(true);
      jest.spyOn(adminService, 'checkDuplicatedUser').mockResolvedValue(false);
      const mockResult = {
        email: 'example@gmail.com',
        username: 'username',
        id: 1,
      };
      jest
        .spyOn(adminService, 'createPartnership')
        .mockResolvedValue(mockResult as any);
      const response = await request(app.getHttpServer())
        .post('/admin')
        .send(mockCreatePartnership)
        .expect(HttpStatus.CREATED);

      expect(response.body.email).toEqual(mockResult.email);
      expect(response.body.username).toEqual(mockResult.username);
      expect(response.body.id).toEqual(mockResult.id);
    });

    it('should throw an exception if user does not have permission', async () => {
      jest.spyOn(adminService, 'checkPermissionUser').mockResolvedValue(false);
      const response = await request(app.getHttpServer())
        .post('/admin')
        .send(mockCreatePartnership)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(response.body.message).toEqual(
        Causes.USER_DONT_HAVE_PERMISSION.message
      );
    });
  });

  describe('POST /admin/:id/change-status', () => {
    it('should update status of an admin', async () => {
      jest.spyOn(adminService, 'checkPermissionUser').mockResolvedValue(true);
      //update another user id
      jest
        .spyOn(adminService, 'getUserById')
        .mockResolvedValue({...mockAdmin, id: 2} as any);
      jest
        .spyOn(adminService, 'updateStatus')
        .mockResolvedValue({...mockAdmin, id: 2, status: 'INACTIVE'} as any);
      const response = await request(app.getHttpServer())
        .post(`/admin/${mockAdmin.id}/change-status`)
        .send(mockUpdateStatus)
        .expect(HttpStatus.CREATED);

      expect(response.body.status).toEqual(mockUpdateStatus.status);
    });

    it('should throw an exception if user does not have permission', async () => {
      jest.spyOn(adminService, 'checkPermissionUser').mockResolvedValue(false);
      const response = await request(app.getHttpServer())
        .post(`/admin/${mockAdmin.id}/change-status`)
        .send(mockUpdateStatus)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(response.body.message).toEqual(
        Causes.USER_DONT_HAVE_PERMISSION.message
      );
    });
  });

  //   describe('POST /admin/update-password', () => {
  //     it('should update password of an admin', async () => {
  //       const response = await request(app.getHttpServer())
  //         .post('/admin/update-password')
  //         .send(mockUpdateAdminPassword)
  //         .set('Authorization', `Bearer ${jwtService.sign(mockRequestWithUser)}`)
  //         .expect(HttpStatus.OK);

  //       expect(response.body).toMatchObject(mockAdmin);
  //     });

  //     it('should throw an exception if user is not authenticated', async () => {
  //       const response = await request(app.getHttpServer())
  //         .post('/admin/update-password')
  //         .send(mockUpdateAdminPassword)
  //         .expect(HttpStatus.UNAUTHORIZED);

  //       expect(response.body.message).toEqual(Causes.USER_UNAUTHORIZED.message);
  //     });

  //     it('should throw an exception if old password is incorrect', async () => {
  //       const invalidUpdateAdminPassword: UpdateAdminPassword = {
  //         oldPassword: 'wrongpassword',
  //         newPassword: 'newpassword',
  //       };

  //       const response = await request(app.getHttpServer())
  //         .post('/admin/update-password')
  //         .send(invalidUpdateAdminPassword)
  //         .set('Authorization', `Bearer ${jwtService.sign(mockRequestWithUser)}`)
  //         .expect(HttpStatus.BAD_REQUEST);

  //       expect(response.body.message).toEqual(Causes.DATA_INVALID.message);
  //     });
  //   });
});
