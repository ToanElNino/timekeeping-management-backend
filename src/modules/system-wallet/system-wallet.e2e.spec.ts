/* eslint-disable node/no-unpublished-import */
// ```yarn test -- src/modules/system-wallet/system-wallet.e2e.spec.ts --verbose``` to run test
import {INestApplication, HttpStatus} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import request from 'supertest';
import {AppModule} from '../../app.module';
import {getRepositoryToken} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {SystemWallet} from 'src/database/entities';
import {SystemWalletController} from 'src/modules/system-wallet/systemWallet.controller';
import {SystemWalletService} from 'src/modules/system-wallet/systemWallet.service';
import {LIST_WALLET_MOCK, WALLET_ITEM_MOCK} from './data-mock';
import {CreateSystemWalletReq} from './request/create-system-wallet';
import {AuthService} from '../auth/auth.service';
import {AuthModule} from '../auth/auth.module';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';
import {ChangeWalletStatusReq} from './request/change-wallet-status';

describe('SystemWalletController (e2e)', () => {
  let app: INestApplication;
  let systemWallet: SystemWallet;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      // imports: [AuthModule],
      controllers: [SystemWalletController],
      providers: [
        SystemWalletService,
        {
          provide: getRepositoryToken(SystemWallet), // assuming you're using TypeORM
          useClass: Repository, // assuming this is the actual repository class
        },
        // AuthService,
      ],
    })
      .overrideProvider(SystemWalletService)
      .useValue({
        getListSystemWallet: jest.fn().mockImplementation(() => {
          return [WALLET_ITEM_MOCK];
        }),
        createNewSystemWallet: jest.fn().mockImplementation(() => {
          return WALLET_ITEM_MOCK;
        }),
        getASystemWallet: jest.fn().mockImplementation(() => {
          return WALLET_ITEM_MOCK;
        }),
        changeStatus: jest.fn().mockImplementation(() => {
          return {...WALLET_ITEM_MOCK, status: 'INACTIVE'};
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

  describe('POST /system-wallets', () => {
    it('should create a new system wallet', async () => {
      const params: CreateSystemWalletReq = {
        systemWallet: '0x1ABC7154748D1CE5144478CDEB574AE244B939B5',
        chainId: 1,
        name: 'NAME',
      };
      const response = await request(app.getHttpServer())
        .post('/system-wallets')
        .send(params)
        .expect(HttpStatus.CREATED);
      const data = response.body;
      // expect()
      expect(data.systemWallet).toEqual(params.systemWallet);
      expect(data.status).toEqual('ACTIVE');
      expect(data.chainId).toEqual(params.chainId);
      expect(data.name).toEqual(params.name);
      systemWallet = data;
    });
  });

  describe('GET /system-wallets', () => {
    it('should return a list of payment requests', async () => {
      const response = await request(app.getHttpServer())
        .get('/system-wallets')
        .query({limit: 10, offset: 0})
        .expect(HttpStatus.OK);

      const data = response.body;
      expect(data).toEqual([systemWallet]);
      expect(data.length).toBeGreaterThan(0);
    });
  });
  describe('GET /system-wallets/get-an-item', () => {
    it('should return a system wallet had been created above', async () => {
      const endPoint = `?system_wallet=${systemWallet.systemWallet}s&chain_id=${systemWallet.chainId}`;
      const response = await request(app.getHttpServer())
        .get('/system-wallets/get-an-item' + endPoint)
        .expect(HttpStatus.OK);
      const data = response.body;
      expect(data.systemWallet).toEqual(systemWallet.systemWallet);
      expect(data.name).toEqual(systemWallet.name);
      expect(data.chainId).toEqual(systemWallet.chainId);
      expect(data.status).toEqual(systemWallet.status);
    });
  });

  describe('PUT /system-wallets/change-status', () => {
    it('should change status system wallet', async () => {
      const params: ChangeWalletStatusReq = {
        systemWallet: systemWallet.systemWallet,
        chainId: systemWallet.chainId,
        newStatus: 'INACTIVE',
      };
      const response = await request(app.getHttpServer())
        .put('/system-wallets/change-status')
        .send(params)
        .expect(HttpStatus.OK);
      // console.log('response: ', response.body);
      const data = response.body;
      // expect()
      expect(data.systemWallet).toEqual(params.systemWallet);
      expect(data.status).toEqual('INACTIVE');
      expect(data.chainId).toEqual(params.chainId);
    });
  });
});
