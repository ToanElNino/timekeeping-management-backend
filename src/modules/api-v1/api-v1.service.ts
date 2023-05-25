import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import {IPaginationOptions} from 'nestjs-typeorm-paginate';
import {PaginationResponse} from '../../config/rest/paginationResponse';
import {getArrayPaginationBuildTotal} from '../../shared/Utils';
import {ApiKey} from '../../database/entities';
import {UpdateStatusApi} from './request/update-status.dto';
import {ApiKeyResponse} from './response/api-key-response.dto';
import {KeyApiFilter} from './request/KeyApiFilter.dto';
import {ApiKeyRepository} from './api-key.repository';
@Injectable()
export class ApiV1Service {
  constructor(private readonly apiKeyRepo: ApiKeyRepository) {}

  async createApiKey(): Promise<ApiKeyResponse> {
    const key = await crypto.randomBytes(32).toString('hex');
    const apiSecret = key.substring(20);
    const apiKey = key.substr(0, 20);
    const hashedApiSecret = await argon2.hash(apiSecret);

    const apiKeyItem = new ApiKey();
    apiKeyItem.apiKey = apiKey;
    apiKeyItem.apiSecret = hashedApiSecret;
    apiKeyItem.status = 'ACTIVE';

    try {
      await this.apiKeyRepo.save(apiKeyItem);
    } catch (err) {
      throw new Error('Create api key duplicate');
    }
    delete apiKeyItem.apiSecret;
    apiKeyItem.apiKey = key;
    return apiKeyItem;
  }

  async getListApi(
    paginationOptions: IPaginationOptions,
    keyApiFilter: KeyApiFilter
  ): Promise<PaginationResponse<ApiKey>> {
    const offset = this.getOffset(paginationOptions);
    const limit = Number(paginationOptions.limit);

    const {apiKey, apiKeyCountList} = await this.apiKeyRepo.filterKeyApi(
      offset,
      limit,
      keyApiFilter
    );
    const {items, meta} = getArrayPaginationBuildTotal<ApiKey>(
      apiKey,
      apiKeyCountList,
      paginationOptions
    );
    return {
      results: items,
      pagination: meta,
    };
  }
  async detail(id: number): Promise<any> {
    const apiKey = await this.apiKeyRepo.findOne({
      where: {
        id: id,
      },
    });
    delete apiKey.apiSecret;
    return apiKey;
  }
  async updateStatus(id: number, data: UpdateStatusApi): Promise<any> {
    const apiKey = await this.apiKeyRepo.findOne({
      where: {
        id: id,
      },
    });
    apiKey.status = data.status;
    this.apiKeyRepo.save(apiKey);
    delete apiKey.apiSecret;
    return apiKey;
  }
  getOffset(paginationOptions: IPaginationOptions) {
    let offset = 0;
    if (paginationOptions.page && paginationOptions.limit) {
      if (+paginationOptions.page > 0) {
        offset =
          (Number(paginationOptions.page) - 1) *
          Number(paginationOptions.limit);
      }
    }
    return offset;
  }
}
