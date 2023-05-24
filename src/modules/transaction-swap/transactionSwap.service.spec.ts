// eslint-disable-next-line node/no-unpublished-import
import {Test} from '@nestjs/testing';
// import {LIST_USER_MOCK} from './data-mock';
import {PaginationResponse} from 'src/config/rest/paginationResponse';
import {TypeOrmModule, getRepositoryToken} from '@nestjs/typeorm';
import {
  CurrencyConfig,
  KmsCmk,
  KmsDataKey,
  SystemWallet,
  TransactionSwap,
  User,
} from '../../database/entities';
import {KmsService} from '../common/kms.service';
import {Repository} from 'typeorm';
import {Causes} from '../../config/exception/causes';
import {HttpException} from '@nestjs/common/exceptions';
import {HttpStatus} from '@nestjs/common';
import {TransactionSwapService} from './transactionSwap.service';
import {TransactionSwapRepository} from './transactionSwap.repository';
import {LIST_SWAP_MOCK} from './data-mock';
describe('TransactionSwapService', () => {
  let service: TransactionSwapService;
  let repository: TransactionSwapRepository;
  ///
  beforeEach(async () => {
    // console.log(databaseConfig);
    const moduleRef = await Test.createTestingModule({
      imports: [
        // TransactionSwapRepository,
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
        TransactionSwapService,
        TransactionSwapRepository,
        {
          provide: getRepositoryToken(TransactionSwap),
          useValue: {
            transactionSwapFilter: jest.fn(),
            // save: jest.fn(),
          },
          useClass: Repository,
        },
        // TransactionSwapRepository,
        // {
        //   provide: getRepositoryToken(User),
        //   useValue: {
        //     findOne: jest.fn(),
        //     save: jest.fn(),
        //   },
        //   useClass: Repository,
        // },
      ],
    }).compile();

    service = moduleRef.get<TransactionSwapService>(TransactionSwapService);
    repository = moduleRef.get<TransactionSwapRepository>(
      TransactionSwapRepository
    );
  });
  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('repository should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('find list transaction swap', () => {
    it('should return an array of transaction swap and pagination', async () => {
      const result: PaginationResponse<any> = {
        pagination: {
          currentPage: 1,
          itemCount: 1,
          itemsPerPage: 10,
          totalItems: 1,
          totalPages: 1,
        },
        results: LIST_SWAP_MOCK,
      };
      const test = [{Total: 1}];

      const mock_filter_value = {
        data: LIST_SWAP_MOCK,
        countData: test,
      };
      jest
        .spyOn(repository, 'transactionSwapFilter')
        .mockImplementation(async () => mock_filter_value);
      expect(
        await service.getListTransactionSwap(
          {status: '', name: ''},
          {page: 1, limit: 10}
        )
      ).toEqual(result);
    });
  });

  // describe('filter fn from repository', () => {
  //   it('should return data list and count as RowDataPacket', async () => {
  //     const mock_filter_value = {
  //       data: LIST_SWAP_MOCK,
  //       countData: test,
  //     };
  //     // jest
  //     //   .spyOn(repository, 'transactionSwapFilter')
  //     //   .mockImplementation(async () => mock_filter_value);
  //     expect(
  //       await repository.transactionSwapFilter(1, 10, {
  //         status: '',
  //         name: '',
  //       })
  //     ).toEqual(mock_filter_value);
  //   });
  // });
});
