// ```yarn test -- src/modules/token/token.e2e.spec.ts --verbose``` to run test

import {Test, TestingModule} from '@nestjs/testing';
import {HttpStatus, INestApplication} from '@nestjs/common';
import request from 'supertest';
import {TokenController} from './token.controller';
import {TokenService} from './token.service';
import {TokenRequest} from './request/TokenRequest.dto';
import {EmptyObject} from '../../shared/response/emptyObject.dto';
import {TokenUpdateStatus} from './request/UpdateStatus.dto';
import {PageOptionsDto} from '../../shared/Request/baseRequest.dto';
import {TokenFilterRequest} from './request/TokenFilterRequest.dto';
import {getRepositoryToken} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Chain, Token, TokenMultichain} from '../../database/entities';
import {TokenModuleRepository} from './token.repository';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';

describe('TokenController (e2e)', () => {
  let app: INestApplication;
  let controller: TokenController;
  let service: TokenService;

  const token = {
    id: 1,
    name: 'Ethereum',
    symbol: 'ETH',
    status: 'ACTIVE',
    isNativeToken: true,
    icon: 'https:/localhost:3001/icon.png',
    type: 'DEFAULT',
    createdAt: 123456789,
    updatedAt: 123456789,
    multichain: [
      {
        id: 1,
        chainId: 1,
        tokenId: 1,
        tokenAddress: '0x8cB2a62E7dfe7557c0481ed6EC4A3b3Aed65eF1e',
        decimal: 1,
        createdAt: 123456789,
        updatedAt: 123456789,
        chainName: 'Ethereum',
        icon: 'https:/localhost:3001/icon.png',
      },
    ],
  };
  const createToken = {
    name: 'Ethereum',
    symbol: 'ETH',
    status: 'ACTIVE',
    isNativeToken: true,
    icon: 'https:/localhost:3001/icon.png',
    multichain: [
      {
        tokenAddress: '0x8cB2a62E7dfe7557c0481ed6EC4A3b3Aed65eF1e',
        chainId: 1,
        decimal: 1,
      },
    ],
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [TokenController],
      providers: [
        TokenService,
        TokenModuleRepository,
        {
          provide: getRepositoryToken(Token),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Chain),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(TokenMultichain),
          useClass: Repository,
        },
        {
          provide: TokenService,
          useValue: {
            getTokens: jest.fn().mockImplementation(() => {
              return [token];
            }),
            createTokenMultichain: jest.fn().mockImplementation(() => {
              return token;
            }),
            updateStatus: jest.fn().mockImplementation(() => {
              return {};
            }),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({CanActivate: jest.fn(() => true)})
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    controller = moduleFixture.get<TokenController>(TokenController);
    service = moduleFixture.get<TokenService>(TokenService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /tokens', () => {
    it('should return a list of tokens', async () => {
      const pageOptions: PageOptionsDto = {page: 1, limit: 10};
      const tokenFilter: TokenFilterRequest = {
        status: 'ACTIVE',
        type: 'DEFAULT',
        name: '',
      };
      const response = await request(app.getHttpServer())
        .get('/tokens')
        .query({...pageOptions, ...tokenFilter});
      expect(response.status).toEqual(HttpStatus.OK);
      expect(response.body).toEqual([token]);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('POST /tokens', () => {
    it('should create a new token', async () => {
      jest
        .spyOn(service, 'createTokenMultichain')
        .mockResolvedValue(token as any);

      const response = await request(app.getHttpServer())
        .post('/tokens')
        .send(createToken);

      expect(response.status).toEqual(HttpStatus.CREATED);
      expect(response.body).toEqual(token);
      expect(service.createTokenMultichain).toHaveBeenCalledWith(createToken);
    });
  });

  describe('PUT /tokens/:address/change-status', () => {
    it('should update the status of a token', async () => {
      const address = '0x123456789ABCDEF0123456789ABCDEF01234567';
      const tokenUpdateStatus: TokenUpdateStatus = {
        status: 'INACTIVE',
        reason: 'test',
      };
      const expectedResponse: EmptyObject = {};
      jest
        .spyOn(service, 'updateStatus')
        .mockResolvedValue(expectedResponse as any);

      const response = await request(app.getHttpServer())
        .put(`/tokens/${address}/change-status`)
        .send(tokenUpdateStatus);

      expect(response.status).toEqual(HttpStatus.OK);
      expect(response.body).toEqual(expectedResponse);
      expect(service.updateStatus).toHaveBeenCalledWith(
        address,
        tokenUpdateStatus
      );
    });
  });
});
