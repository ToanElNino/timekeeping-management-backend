// ```yarn test -- src/modules/token/token.service.spec.ts --verbose``` to run test

import {Test, TestingModule} from '@nestjs/testing';
import {TokenService} from './token.service';
import {TokenRequest} from './request/TokenRequest.dto';
import {TokenUpdateStatus} from './request/UpdateStatus.dto';
import {PageOptionsDto} from '../../shared/Request/baseRequest.dto';
import {TokenFilterRequest} from './request/TokenFilterRequest.dto';
import {TokenModuleRepository} from './token.repository';
import {Token, Chain, TokenMultichain} from '../../database/entities';
import {Causes} from 'src/config/exception/causes';
import {getArrayPaginationBuildTotal, getOffset} from '../../shared/Utils';
import {IPaginationOptions} from 'nestjs-typeorm-paginate';
import {getRepositoryToken} from '@nestjs/typeorm';
import {AnyBulkWriteOperation, Repository} from 'typeorm';
import {HttpException, NotFoundException} from '@nestjs/common';

describe('TokenService', () => {
  let service: TokenService;
  let repository: TokenModuleRepository;

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
    repository = module.get<TokenModuleRepository>(TokenModuleRepository);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('createTokenMultichain', () => {
    it('should create a new token', async () => {
      jest.spyOn(service, 'checkChainExist').mockResolvedValueOnce(true);
      jest
        .spyOn(repository, 'createTokenMultichain')
        .mockResolvedValueOnce(token as any);
      const result = await service.createTokenMultichain(createToken as any);
      expect(result).toEqual(token);
      expect(repository.createTokenMultichain).toHaveBeenCalledWith(
        createToken as any
      );
    });

    it('should throw an error if chain not exists', async () => {
      jest.spyOn(service, 'checkChainExist').mockResolvedValueOnce(false);
      try {
        await service.createTokenMultichain(createToken as any);
        fail('createToken should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toEqual('Chain not found');
      }
      expect(service.checkChainExist).toHaveBeenCalled();
    });
  });

  describe('getTokens', () => {
    it('should return a list of tokens', async () => {
      const pageOptions: PageOptionsDto = {page: 1, limit: 10};
      const tokenFilter: TokenFilterRequest = {
        status: 'ACTIVE',
        type: 'DEFAULT',
        name: '',
      };

      const expectedPagination = {
        totalItems: 1,
        itemCount: 1,
        itemsPerPage: 10,
        totalPages: 1,
        currentPage: 1,
      };
      const offset = getOffset(pageOptions as IPaginationOptions);
      const limit = Number(pageOptions.limit);

      jest.spyOn(repository, 'filterToken').mockResolvedValueOnce({
        tokens: [token],
        tokensCountList: [{Total: 1}],
      } as any);

      const result = await service.getTokens(pageOptions, tokenFilter);
      expect(result).toEqual({
        results: [token],
        pagination: expectedPagination,
      });
      expect(repository.filterToken).toHaveBeenCalledWith(
        offset,
        limit,
        tokenFilter
      );
    });
  });

  describe('updateStatus', () => {
    it('should update the status of a token', async () => {
      const id = 1;
      const tokenUpdateStatus: TokenUpdateStatus = {
        status: 'INACTIVE',
        reason: 'test',
      };
      const tokenInactive = {status: 'INACTIVE', ...token};

      jest
        .spyOn(repository.repositoryToken, 'findOne')
        .mockResolvedValueOnce(token as any);
      const tokenRepositorySaveSpy = jest
        .spyOn(repository.repositoryToken, 'save')
        .mockResolvedValueOnce(tokenInactive as any);

      const result = await service.updateStatus(id, tokenUpdateStatus);

      expect(result).toEqual(tokenInactive);
      expect(repository.repositoryToken.findOne).toHaveBeenCalledWith({
        where: {id: id},
      });
      expect(tokenRepositorySaveSpy).toHaveBeenCalledWith(token);
      expect(token.status).toEqual(tokenUpdateStatus.status);
    });
  });
});
