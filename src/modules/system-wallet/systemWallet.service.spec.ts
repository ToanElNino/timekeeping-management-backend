// eslint-disable-next-line node/no-unpublished-import
import {Test} from '@nestjs/testing';
import {SystemWalletController} from './systemWallet.controller';
import {SystemWalletService} from './systemWallet.service';
import {LIST_WALLET_MOCK} from './data-mock';
import {PaginationResponse} from 'src/config/rest/paginationResponse';
import {TypeOrmModule, getRepositoryToken} from '@nestjs/typeorm';
import {
  CurrencyConfig,
  KmsCmk,
  KmsDataKey,
  SystemWallet,
} from '../../database/entities';
import {KmsService} from '../common/kms.service';
import {Repository} from 'typeorm';
import {ChangeWalletStatusReq} from './request/change-wallet-status';
import {Causes} from '../../config/exception/causes';
import {HttpException} from '@nestjs/common/exceptions';
import {HttpStatus} from '@nestjs/common';
import {CreateSystemWalletReq} from './request/create-system-wallet';
import {SystemWalletRepository} from './system-wallet.repository';
describe('SystemWalletService', () => {
  let service: SystemWalletService;
  let repository: SystemWalletRepository;
  let kmsService: KmsService;
  ///
  beforeEach(async () => {
    // console.log(databaseConfig);
    const moduleRef = await Test.createTestingModule({
      imports: [
        // TypeORMMySqlTestingModule([SystemWallet]),
        // TypeOrmModule.forRoot(databaseConfig),
        // SystemWalletModule,
        // TypeOrmModule.forFeature([
        //   SystemWallet,
        //   KmsDataKey,
        //   KmsCmk,
        //   CurrencyConfig,
        // ]),
      ],
      providers: [
        SystemWalletRepository,
        {
          provide: getRepositoryToken(SystemWallet),
          useValue: {
            systemWalletFilter: jest.fn(),
            // save: jest.fn(),
          },
          useClass: Repository,
        },
        SystemWalletService,
        {
          provide: getRepositoryToken(SystemWallet),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
          useClass: Repository,
        },
        KmsService,
        {
          provide: getRepositoryToken(KmsDataKey),
          useValue: () => ({
            encrypt: jest.fn(),
          }),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(KmsCmk),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(CurrencyConfig),
          useClass: Repository,
        },
      ],
    }).compile();

    service = moduleRef.get<SystemWalletService>(SystemWalletService);
    repository = moduleRef.get<SystemWalletRepository>(SystemWalletRepository);
    kmsService = moduleRef.get<KmsService>(KmsService);
    // catsController = moduleRef.get<CatsController>(CatsController);
    // const repo: Repository<SystemWallet> =
    // service = new SystemWalletService(repo);
  });
  it('service should be defined', () => {
    expect(service).toBeDefined();
    // expect(service).toBeDefined();
  });

  it('system wallet repository should be defined', () => {
    expect(repository).toBeDefined();
    // expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of system wallet and pagination', async () => {
      const result: PaginationResponse<any> = {
        pagination: {
          currentPage: 1,
          itemCount: 1,
          itemsPerPage: 10,
          totalItems: 1,
          totalPages: 1,
        },
        results: LIST_WALLET_MOCK as SystemWallet[],
      };
      const test = [{Total: 1}];

      const mock_filter_value = {
        data: LIST_WALLET_MOCK as SystemWallet[],
        countData: test,
      };
      jest
        .spyOn(repository, 'systemWalletFilter')
        .mockImplementation(async () => mock_filter_value);
      expect(
        await service.getListSystemWallet(
          {status: '', name: ''},
          {page: 1, limit: 10}
        )
      ).toEqual(result);
    });
  });
  describe('create system wallet', () => {
    const PRIVATE_KEY_MOCK = 'encrypted privateKey';
    it('should call repository.save with correct params, encrypted privateKey and success', async () => {
      const req: CreateSystemWalletReq = {
        chainId: 8001,
        systemWallet: 'x0123',
        name: 'ABC',
      };
      jest.spyOn(kmsService, 'encrypt').mockResolvedValueOnce(PRIVATE_KEY_MOCK);

      jest.spyOn(repository, 'save').mockResolvedValueOnce({
        systemWallet: 'x0123',
        chainId: 8001,
        status: 'ACTIVE',
        name: 'ABC',
        createdAt: 0,
        updatedAt: 0,
      } as SystemWallet);
      await service.createNewSystemWallet(req);
    });
    it('should return exception due to kms service failure', async () => {
      const req: CreateSystemWalletReq = {
        chainId: 8001,
        systemWallet: 'x0123',
        name: 'ABC',
      };
      jest.spyOn(kmsService, 'encrypt').mockResolvedValueOnce(undefined);

      try {
        await service.createNewSystemWallet(req);
      } catch (error) {
        expect(error).toEqual(
          Causes.CANNOT_CREATE_SYSTEM_WALLET_DUE_TO_KMS_FAILED
        );
      }
    });
    it('should return http exception when call repository.save ', async () => {
      const req: CreateSystemWalletReq = {
        chainId: 8001,
        systemWallet: 'x0123',
        name: 'ABC',
      };
      jest.spyOn(kmsService, 'encrypt').mockResolvedValueOnce(PRIVATE_KEY_MOCK);

      jest.spyOn(repository, 'save').mockResolvedValueOnce(undefined);
      try {
        await service.createNewSystemWallet(req);
      } catch (error) {
        expect(error).toEqual(
          Causes.CANNOT_CREATE_WALLET_DUE_TO_SAVE_REPOSITORY
        );
      }
    });
  });
  describe('change status system wallet', () => {
    it('should call repository.save with correct params and update success ', async () => {
      const req: ChangeWalletStatusReq = {
        chainId: 0,
        systemWallet: '',
        newStatus: 'INACTIVE',
      };
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce({
        systemWallet: 'x0123',
        chainId: 8001,
        status: 'ACTIVE',
        name: '',
        privateKey: '',
        createdAt: 0,
        updatedAt: 0,
      } as SystemWallet);
      jest.spyOn(repository, 'save').mockResolvedValueOnce({
        systemWallet: 'x0123',
        chainId: 8001,
        status: 'INACTIVE',
        name: '',
        privateKey: '',
        createdAt: 0,
        updatedAt: 0,
      } as SystemWallet);

      const res = await service.changeStatus(req);

      expect(repository.save).toHaveBeenCalledWith({
        systemWallet: 'x0123',
        chainId: 8001,
        status: 'INACTIVE',
        name: '',
        privateKey: '',
        createdAt: 0,
        updatedAt: 0,
      });
      expect(res).toStrictEqual({
        systemWallet: 'x0123',
        chainId: 8001,
        status: 'INACTIVE',
        name: '',
        createdAt: 0,
        updatedAt: 0,
      });
    });

    it('should return invalid status http exception ', async () => {
      const req: ChangeWalletStatusReq = {
        chainId: 0,
        systemWallet: 'fake address',
        newStatus: 'NOTACTIVE',
      };
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce({
        systemWallet: 'x0123',
        chainId: 8001,
        status: 'ACTIVE',
        name: '',
        privateKey: '',
        createdAt: 0,
        updatedAt: 0,
      } as SystemWallet);
      try {
        await service.changeStatus(req);
      } catch (error) {
        expect(error).toEqual(
          Causes.CANNOT_UPDATE_STATUS_DUE_TO_INVALID_STATUS
        );
      }
    });

    it('should return http exception because new status is the same to old status ', async () => {
      const req: ChangeWalletStatusReq = {
        chainId: 0,
        systemWallet: 'fake address',
        newStatus: 'ACTIVE',
      };
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce({
        systemWallet: 'x0123',
        chainId: 8001,
        status: 'ACTIVE',
        name: '',
        privateKey: '',
        createdAt: 0,
        updatedAt: 0,
      } as SystemWallet);
      try {
        await service.changeStatus(req);
      } catch (error) {
        expect(error).toEqual(
          Causes.CANNOT_UPDATE_STATUS_DUE_TO_SAME_OLD_STATUS
        );
      }
    });
    it('should return http exception when call repository.save ', async () => {
      const req: ChangeWalletStatusReq = {
        chainId: 0,
        systemWallet: 'x0123',
        newStatus: 'INACTIVE',
      };
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce({
        systemWallet: 'x0123',
        chainId: 8001,
        status: 'ACTIVE',
        name: '',
        privateKey: '',
        createdAt: 0,
        updatedAt: 0,
      } as SystemWallet);
      jest.spyOn(repository, 'save').mockResolvedValueOnce(undefined);
      try {
        await service.changeStatus(req);
      } catch (error) {
        expect(error).toEqual(
          Causes.CANNOT_UPDATE_STATUS_DUE_TO_SAVE_REPOSITORY
        );
      }
    });
    it('should return http exception when cannot find system wallet item ', async () => {
      const req: ChangeWalletStatusReq = {
        chainId: 0,
        systemWallet: 'x0123',
        newStatus: 'INACTIVE',
      };
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(undefined);
      try {
        await service.changeStatus(req);
      } catch (error) {
        expect(error).toEqual(
          Causes.CANNOT_UPDATE_STATUS_DUE_TO_ITEM_NOT_FOUND
        );
      }
    });
  });
});
