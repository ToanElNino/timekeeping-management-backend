/* eslint-disable node/no-unpublished-import */
import {Test, TestingModule} from '@nestjs/testing';
import {ExecutionContext, HttpStatus, INestApplication} from '@nestjs/common';
import request from 'supertest';
import {AppModule} from '../../app.module';
import {MerchantService} from './merchant.service';
import {getRepositoryToken} from '@nestjs/typeorm';
import {Merchant, User} from '../../database/entities';
import {Repository} from 'typeorm';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';

describe('MerchantController (E2E)', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        MerchantService,
        {
          provide: getRepositoryToken(Merchant),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = {};
          return true;
        },
      })
      .compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/merchants (GET)', () => {
    it('should return all merchants', () => {
      return request(app.getHttpServer())
        .get('/merchants?userWallet=0x12689899f87AEC3782BD0F2F58C7dFd74e66fd19')
        .expect(HttpStatus.OK)
        .expect(res => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeInstanceOf(Array);
        });
    });

    it('should return paginated merchants', () => {
      return request(app.getHttpServer())
        .get(
          '/merchants?page=1&limit=10&userWallet=0x12689899f87AEC3782BD0F2F58C7dFd74e66fd19'
        )
        .expect(HttpStatus.OK)
        .expect(res => {
          expect(res.body).toBeDefined();
          expect(res.body.meta).toHaveProperty('pagination');
          expect(res.body).toHaveProperty('data');
          expect(res.body.data).toBeInstanceOf(Array);
        });
    });
  });

  describe('/:merchant_wallet (GET)', () => {
    it('should return merchant', () => {
      return request(app.getHttpServer())
        .get('/merchants/0x12689899f87AEC3782BD0F2F58C7dFd74e66fd19')
        .expect(HttpStatus.OK)
        .expect(res => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeInstanceOf(Object);
        });
    });
  });

  describe('/merchants (POST)', () => {
    it('should return success message', () => {
      return request(app.getHttpServer())
        .post('/merchants')
        .send({
          name: 'lehuyaa',
          avatar:
            'https://media.vov.vn/sites/default/files/styles/large/public/2021-02/1_133.jpg',
          longitude: 21.037683378972403,
          latitude: 105.83423350365294,
          merchant_wallet: '0x93902d47bE75950242D2557588cF45F0D3da281123',
          address: '82 Duy Tan',
        })
        .expect(HttpStatus.CREATED)
        .expect(res => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeInstanceOf(Object);
          expect(res.body.data.message).toBeDefined();
        });
    });

    it('should return success message', () => {
      return request(app.getHttpServer())
        .post('/merchants')
        .send({
          avatar:
            'https://media.vov.vn/sites/default/files/styles/large/public/2021-02/1_133.jpg',
          longitude: 21.037683378972403,
          latitude: 105.83423350365294,
          merchant_wallet: '0x93902d47bE75950242D2557588cF45F0D3da281123',
          address: '82 Duy Tan',
        })
        .expect(HttpStatus.CREATED)
        .expect(res => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeInstanceOf(Object);
          expect(res.body.data.message).toBeDefined();
        });
    });
  });

  describe('/:merchant_wallet/change-status (PUT)', () => {
    it('should return success message', () => {
      return request(app.getHttpServer())
        .put(
          '/merchants/0x93902d47bE75950242D2557588cF45F0D3da2814/change-status'
        )
        .send({
          status: 1,
        })
        .expect(HttpStatus.OK)
        .expect(res => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeInstanceOf(Object);
          expect(res.body.data.message).toEqual('ACTIVE Merchant Successful');
        });
    });

    it('should return success message', () => {
      return request(app.getHttpServer())
        .put(
          '/merchants/0x93902d47bE75950242D2557588cF45F0D3da2814/change-status'
        )
        .send({
          status: 2,
        })
        .expect(HttpStatus.OK)
        .expect(res => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeInstanceOf(Object);
          expect(res.body.data.message).toEqual('INACTIVE Merchant Successful');
        });
    });
  });
});
