/* eslint-disable node/no-unpublished-import */
// ```yarn test -- src/modules/user/user.e2e.spec.ts --verbose``` to run test
import {INestApplication, HttpStatus} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import request from 'supertest';
import {getRepositoryToken} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {LIST_USER_MOCK} from './data-mock';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';
import {TransactionSwap, User} from 'src/database/entities';
import {UserController} from './user.controller';
import {UserService} from './user.service';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  // let transactionSwap: TransactionSwap;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      // imports: [AuthModule],
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User), // assuming you're using TypeORM
          useClass: Repository, // assuming this is the actual repository class
        },
        // AuthService,
      ],
    })
      .overrideProvider(UserService)
      .useValue({
        getListEndUser: jest.fn().mockImplementation(() => {
          return LIST_USER_MOCK;
        }),
      })
      .overrideGuard(JwtAuthGuard)
      .useValue({CanActivate: jest.fn(() => true)})
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /users', () => {
    it('should return a list of end user', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .query({limit: 10, offset: 0})
        .expect(HttpStatus.OK);

      const data = response.body;
      //nothing is special here :)))
      expect(data).toEqual(LIST_USER_MOCK);
      expect(data.length).toBeGreaterThan(0);
    });
  });
});
