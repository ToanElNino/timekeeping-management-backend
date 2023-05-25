/* eslint-disable node/no-unpublished-import */
import {INestApplication, HttpStatus} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Chain} from 'src/database/entities';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';
import request from 'supertest';
import {ChainController} from './chain.controller';
import {ChainService} from './chain.service';
import {S3Handler} from 'src/shared/S3Handler';
import {CHAIN_ITEM_MOCK} from './data-mock';

describe('ChainController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      // imports: [AuthModule],
      controllers: [ChainController],
      providers: [
        S3Handler,
        ChainService,
        {
          provide: getRepositoryToken(Chain), // assuming you're using TypeORM
          useClass: Repository, // assuming this is the actual repository class
        },
        // AuthService,
      ],
    })
      .overrideProvider(ChainService)
      .useValue({
        getListChain: jest.fn().mockImplementation(() => {
          return [CHAIN_ITEM_MOCK];
        }),
      })
      .overrideGuard(JwtAuthGuard)
      .useValue({CanActivate: jest.fn(() => true)})
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('GET /chains', () => {
    it('should return a list of payment requests', async () => {
      const response = await request(app.getHttpServer())
        .get('/chains')
        .query({limit: 10, offset: 0})
        .expect(HttpStatus.OK);

      const data = response.body;
      expect(data).toEqual([CHAIN_ITEM_MOCK]);
      expect(data.length).toBeGreaterThan(0);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
