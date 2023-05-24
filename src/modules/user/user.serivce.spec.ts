// eslint-disable-next-line node/no-unpublished-import
import {Test} from '@nestjs/testing';
import {LIST_USER_MOCK} from './data-mock';
import {PaginationResponse} from 'src/config/rest/paginationResponse';
import {TypeOrmModule, getRepositoryToken} from '@nestjs/typeorm';
import {
  CurrencyConfig,
  KmsCmk,
  KmsDataKey,
  SystemWallet,
  User,
} from '../../database/entities';
import {KmsService} from '../common/kms.service';
import {Repository} from 'typeorm';
import {Causes} from '../../config/exception/causes';
import {HttpException} from '@nestjs/common/exceptions';
import {HttpStatus} from '@nestjs/common';
import {UserService} from './user.service';
import {UserRepository} from './user.repository';
describe('UserService', () => {
  let service: UserService;
  let repository: UserRepository;
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
        UserRepository,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
          useClass: Repository,
        },
        UserService,
      ],
    }).compile();

    service = moduleRef.get<UserService>(UserService);
    repository = moduleRef.get<UserRepository>(UserRepository);
  });
  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('user repository should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of user and pagination', async () => {
      const result: PaginationResponse<any> = {
        pagination: {
          currentPage: 1,
          itemCount: 1,
          itemsPerPage: 10,
          totalItems: 1,
          totalPages: 1,
        },
        results: LIST_USER_MOCK as User[],
      };
      const test = [{Total: 1}];

      const mock_filter_value = {
        data: LIST_USER_MOCK as User[],
        countData: test,
      };
      jest
        .spyOn(repository, 'filterUser')
        .mockImplementation(async () => mock_filter_value);
      expect(
        await service.getListEndUser(
          {status: '', walletAddress: ''},
          {page: 1, limit: 10}
        )
      ).toEqual(result);
    });
  });
});
