/* eslint-disable node/no-unpublished-import */
// ```yarn test -- src/modules/transaction-swap/transactionSwap.e2e.spec.ts --verbose``` to run test
import {INestApplication, HttpStatus} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import request from 'supertest';
import {getRepositoryToken} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {LIST_SWAP_MOCK} from './data-mock';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';
import {TransactionSwapController} from './transactionSwap.controller';
import {TransactionSwapService} from './transactionSwap.service';
import {TransactionSwap} from 'src/database/entities';

describe('TransactionSwapController (e2e)', () => {
  let app: INestApplication;
  // let transactionSwap: TransactionSwap;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      // imports: [AuthModule],
      controllers: [TransactionSwapController],
      providers: [
        TransactionSwapService,
        {
          provide: getRepositoryToken(TransactionSwap), // assuming you're using TypeORM
          useClass: Repository, // assuming this is the actual repository class
        },
        // AuthService,
      ],
    })
      .overrideProvider(TransactionSwapService)
      .useValue({
        getListTransactionSwap: jest.fn().mockImplementation(() => {
          return LIST_SWAP_MOCK;
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

  describe('GET /swap-transactions', () => {
    it('should return a list of swap transaction', async () => {
      const response = await request(app.getHttpServer())
        .get('/swap-transactions')
        .query({limit: 10, offset: 0})
        .expect(HttpStatus.OK);

      const data = response.body;
      //nothing is special here :)))
      expect(data).toEqual(LIST_SWAP_MOCK);
      expect(data.length).toBeGreaterThan(0);
    });
  });
});
