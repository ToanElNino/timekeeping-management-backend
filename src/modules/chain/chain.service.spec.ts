// ```yarn test -- src/modules/token/token.service.spec.ts --verbose``` to run test

import {Test, TestingModule} from '@nestjs/testing';
import {Chain, Token} from '../../database/entities';
import {Causes} from 'src/config/exception/causes';
import {getArrayPaginationBuildTotal, getOffset} from '../../shared/Utils';
import {IPaginationOptions} from 'nestjs-typeorm-paginate';
import {getRepositoryToken} from '@nestjs/typeorm';
import {AnyBulkWriteOperation, Repository} from 'typeorm';
import {HttpException, HttpStatus, NotFoundException} from '@nestjs/common';
import {ChainService} from './chain.service';
import {ChainRepository} from './chain.repository';
import {S3Handler} from 'src/shared/S3Handler';
import {PaginationResponse} from 'src/config/rest/paginationResponse';
import {LIST_CHAIN_MOCK} from './data-mock';
import {CreateChainRequest} from './request/CreateChainRequest.dto';
import {error} from 'console';
import {UpdateChainRequest} from './request/UpdateChainRequest.dto';
import {UpdateStatusChainReq} from './request/UpdateStatusChainRequest.dto';

describe('ChainService', () => {
  let service: ChainService;
  let chainRepo: ChainRepository;
  let s3Handler: S3Handler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChainService,
        ChainRepository,
        {
          provide: getRepositoryToken(Chain),
          useClass: Repository,
        },
        S3Handler,
      ],
    }).compile();

    service = module.get<ChainService>(ChainService);
    chainRepo = module.get<ChainRepository>(ChainRepository);
    s3Handler = module.get<S3Handler>(S3Handler);
  });
  it('service should be defined', () => {
    expect(service).toBeDefined();
    // expect(service).toBeDefined();
  });

  it('chain repository should be defined', () => {
    expect(chainRepo).toBeDefined();
    // expect(service).toBeDefined();
  });

  describe('getListChain', () => {
    it('should return an array of chain and pagination', async () => {
      const result: PaginationResponse<any> = {
        pagination: {
          currentPage: 1,
          itemCount: 3,
          itemsPerPage: 10,
          totalItems: 3,
          totalPages: 1,
        },
        results: LIST_CHAIN_MOCK as Chain[],
      };

      const mock_filter_value = {
        data: LIST_CHAIN_MOCK as Chain[],
        countData: [{Total: 3}],
      };
      jest
        .spyOn(chainRepo, 'getListChain')
        .mockImplementation(async () => mock_filter_value);
      expect(
        await service.getListChain({status: '', name: ''}, {page: 1, limit: 10})
      ).toEqual(result);
    });
  });
  describe('create chain', () => {
    it('should return success response', async () => {
      const req: CreateChainRequest = {
        symbol: 'ETH',
        chainName: 'Ethereum',
        id: 323232799,
        explorerEndpoint: 'https://example',
        scanApi: 'https://example',
        iconFile: null,
        rpcEndpoint: 'https://example',
      };

      jest.spyOn(chainRepo, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(chainRepo, 'createChain').mockResolvedValueOnce({
        id: 323232799,
        chainName: 'Ethereum',
        icon: null,
        status: 'ACTIVE',
        scanApi: 'https://example',
        rpcEndpoint: 'https://example',
        explorerEndpoint: 'https://example',
        createdAt: 1681355502,
        updatedAt: 1681355502,
      });
      const res = await service.createNewChain(null, req);
      expect(res.chainName).toBe('Ethereum');
    });

    it('should return exception: chain id existed', async () => {
      const req: CreateChainRequest = {
        symbol: 'ETH',
        chainName: 'Ethereum',
        id: 323232799,
        explorerEndpoint: 'https://example',
        scanApi: 'https://example',
        iconFile: null,
        rpcEndpoint: 'https://example',
      };

      jest
        .spyOn(chainRepo, 'findOne')
        .mockResolvedValueOnce({id: 323232799} as Chain);
      try {
        await service.createNewChain(null, req);
      } catch (error) {
        expect(error).toEqual(
          new HttpException('Chain id existed', HttpStatus.BAD_REQUEST)
        );
      }
    });
  });

  describe('update chain', () => {
    it('should return success response', async () => {
      const req: UpdateChainRequest = {
        symbol: 'ETH',
        chainName: 'Ethereum',
        id: 323232799,
        explorerEndpoint: 'https://example',
        scanApi: 'https://example',
        iconFile: null,
        rpcEndpoint: 'https://example',
      };

      jest
        .spyOn(chainRepo, 'findOne')
        .mockResolvedValueOnce({id: 323232799} as Chain);
      jest.spyOn(chainRepo, 'save').mockResolvedValueOnce({
        id: 323232799,
        chainName: 'Ethereum',
        symbol: 'ETH',
        icon: null,
        status: 'ACTIVE',
        scanApi: 'https://example',
        rpcEndpoint: 'https://example',
        explorerEndpoint: 'https://example',
        createdAt: 1681355502,
        updatedAt: 1681355502,
      } as Chain);
      const res = await service.updateChain(null, req);
      expect(res.chainName).toBe('Ethereum');
      expect(res.status).toBe('ACTIVE');
    });

    it('should return exception: chain id does not exist', async () => {
      const req: UpdateChainRequest = {
        chainName: 'Ethereum',
        symbol: 'ETH',
        id: 323232799,
        explorerEndpoint: 'https://example',
        scanApi: 'https://example',
        iconFile: null,
        rpcEndpoint: 'https://example',
      };

      jest.spyOn(chainRepo, 'findOne').mockResolvedValueOnce(null);
      try {
        await service.updateChain(null, req);
      } catch (error) {
        expect(error).toEqual(
          new HttpException('Chain id does not exist', HttpStatus.BAD_REQUEST)
        );
      }
    });
    it('should return exception: Image icon upload error', async () => {
      const req: UpdateChainRequest = {
        chainName: 'Ethereum',
        symbol: 'ETH',
        id: 323232799,
        explorerEndpoint: 'https://example',
        scanApi: 'https://example',
        iconFile: {},
        rpcEndpoint: 'https://example',
      };

      jest.spyOn(chainRepo, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(s3Handler, 'upload').mockResolvedValueOnce(null);
      try {
        await service.createNewChain({} as Express.Multer.File, req);
      } catch (error) {
        expect(error).toEqual(
          new HttpException(
            'Image icon upload error',
            HttpStatus.INTERNAL_SERVER_ERROR
          )
        );
      }
    });
  });

  describe('update status chain', () => {
    it('should return success response', async () => {
      const req: UpdateStatusChainReq = {
        status: 'INACTIVE',
      };

      jest
        .spyOn(chainRepo, 'findOne')
        .mockResolvedValueOnce({id: 323232799, status: 'ACTIVE'} as Chain);
      jest.spyOn(chainRepo, 'save').mockResolvedValueOnce({
        id: 323232799,
        chainName: 'Ethereum',
        icon: null,
        status: req.status,
        scanApi: 'https://example',
        rpcEndpoint: 'https://example',
        explorerEndpoint: 'https://example',
        createdAt: 1681355502,
        updatedAt: 1681355502,
      } as Chain);
      const res = await service.updateStatus(323232799, req);
      expect(res.chainName).toBe('Ethereum');
      expect(res.status).toBe(req.status);
    });
    it('should return error response: invalid status', async () => {
      const req: UpdateStatusChainReq = {
        status: 'IN-ACTIVE',
      };
      try {
        await service.updateStatus(1, req);
      } catch (error) {
        expect(error).toEqual(
          new HttpException('Invalid status', HttpStatus.BAD_REQUEST)
        );
      }
    });
    it('should return error response: Chain id does not exist', async () => {
      const req: UpdateStatusChainReq = {
        status: 'INACTIVE',
      };
      jest.spyOn(chainRepo, 'findOne').mockResolvedValueOnce(null);
      try {
        await service.updateStatus(1, req);
      } catch (error) {
        expect(error).toEqual(
          new HttpException('Chain id does not exist', HttpStatus.BAD_REQUEST)
        );
      }
    });
    it('should return error response: Same old status', async () => {
      const req: UpdateStatusChainReq = {
        status: 'INACTIVE',
      };
      jest.spyOn(chainRepo, 'findOne').mockResolvedValueOnce({
        id: 1,
        status: 'INACTIVE',
      } as Chain);
      try {
        await service.updateStatus(1, req);
      } catch (error) {
        expect(error).toEqual(
          new HttpException('Same old status', HttpStatus.BAD_REQUEST)
        );
      }
    });
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
});
