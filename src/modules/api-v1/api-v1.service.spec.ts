// ```yarn test -- src/modules/api-v1/api-v1.service.spec.ts --verbose``` to run test

import {Test, TestingModule} from '@nestjs/testing';
import {ApiV1Service} from './api-v1.service';
import {getRepositoryToken} from '@nestjs/typeorm';
import {ApiKey} from 'src/database/entities';
import {Repository} from 'typeorm';
import * as crypto from 'crypto';
import * as argon2 from 'argon2';
import {ApiKeyRepository} from './api-key.repository';

describe('ApiV1Service', () => {
  let service: ApiV1Service;
  let apiKeyRepo: ApiKeyRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiV1Service,
        ApiKeyRepository,
        {
          provide: getRepositoryToken(ApiKey),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ApiV1Service>(ApiV1Service);
    apiKeyRepo = module.get<ApiKeyRepository>(ApiKeyRepository);
  });

  describe('createApiKey', () => {
    // it('should create a new api key', async () => {
    //   const key = '1234567890123456789012345678901234567890';
    //   const hashedApiSecret = await argon2.hash(key.substring(20));
    //   const apiKeyItem = {
    //     apiKey: key.substr(0, 20),
    //     apiSecret: hashedApiSecret,
    //     status: 'ACTIVE',
    //     createdAt: 123456789,
    //     updatedAt: 123456789,
    //   };

    //   jest.mock('crypto', () => ({
    //     randomBytes: jest.fn().mockReturnValue({
    //       toString: () => '1234567890123456789012345678901234567890',
    //     }),
    //   }));
    //   jest.spyOn(apiKeyRepo, 'save').mockResolvedValueOnce(apiKeyItem as any);
    //   const result = await service.createApiKey();
    //   console.log(result, key);
    //   expect(result).toEqual({
    //     apiKey: key,
    //     status: 'ACTIVE',
    //   });
    // });

    it('should throw an error if api key already exists', async () => {
      const apiKeyItem = new ApiKey();
      apiKeyItem.apiKey = '12345678901234567890';
      jest.mock('crypto', () => ({
        randomBytes: jest.fn().mockReturnValue({
          toString: () => '1234567890123456789012345678901234567890',
        }),
      }));
      jest.spyOn(apiKeyRepo, 'save').mockRejectedValueOnce(new Error());
      await expect(service.createApiKey()).rejects.toThrowError(
        'Create api key duplicate'
      );
    });
  });

  describe('detail', () => {
    it('should return the details of an api key', async () => {
      const apiKeyItem = {
        id: 1,
        apiKey: '12345678901234567890',
        apiSecret: 'hashedSecret',
        status: 'ACTIVE',
        createdAt: 123456789,
        updatedAt: 123456789,
      };
      jest
        .spyOn(apiKeyRepo, 'findOne')
        .mockResolvedValueOnce(apiKeyItem as any);
      const result = await service.detail(1);
      expect(result).toEqual({
        id: 1,
        apiKey: '12345678901234567890',
        status: 'ACTIVE',
        createdAt: 123456789,
        updatedAt: 123456789,
      });
    });
  });

  describe('updateStatus', () => {
    it('should update the status of an api key', async () => {
      const apiKeyItem = {
        id: 1,
        apiKey: '12345678901234567890',
        apiSecret: 'hashedSecret',
        status: 'ACTIVE',
        createdAt: 123456789,
        updatedAt: 123456789,
      };
      jest
        .spyOn(apiKeyRepo, 'findOne')
        .mockResolvedValueOnce(apiKeyItem as any);
      jest.spyOn(apiKeyRepo, 'save').mockResolvedValueOnce(apiKeyItem as any);
      const result = await service.updateStatus(1, {status: 'INACTIVE'});
      expect(result).toEqual({
        id: 1,
        apiKey: '12345678901234567890',
        status: 'INACTIVE',
        createdAt: 123456789,
        updatedAt: 123456789,
      });
    });
  });

  describe('getListApi', () => {
    it('should return a list of api keys', async () => {
      const apiKey = [
        {
          id: 1,
          apiKey: '12345678901234567890',
          status: 'ACTIVE',
          createdAt: 123456789,
          updatedAt: 123456789,
        },
        {
          id: 2,
          apiKey: '09876543210987654321',
          status: 'INACTIVE',
          createdAt: 123456789,
          updatedAt: 123456789,
        },
      ];
      const apiKeyCountList = [{Total: 2}];
      jest.spyOn(apiKeyRepo, 'filterKeyApi').mockResolvedValueOnce({
        apiKey,
        apiKeyCountList,
      } as any);
      const resultpaginationOptions = {page: 1, limit: 10};
      const keyFilter = {status: 'ACTIVE'};
      const expectedResponse = {
        results: [
          {
            id: 1,
            apiKey: '12345678901234567890',
            status: 'ACTIVE',
            createdAt: 123456789,
            updatedAt: 123456789,
          },
          {
            id: 2,
            apiKey: '09876543210987654321',
            status: 'INACTIVE',
            createdAt: 123456789,
            updatedAt: 123456789,
          },
        ],
        pagination: {
          currentPage: 1,
          itemCount: 2,
          itemsPerPage: 10,
          totalItems: 2,
          totalPages: 1,
        },
      };
      const result = await service.getListApi(
        resultpaginationOptions,
        keyFilter
      );
      expect(result).toEqual(expectedResponse);
    });
  });
});
