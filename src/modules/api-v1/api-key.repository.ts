import {ApiKey} from 'src/database/entities';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Injectable} from '@nestjs/common';

@Injectable()
export class ApiKeyRepository extends Repository<ApiKey> {
  constructor(
    @InjectRepository(ApiKey)
    repository: Repository<ApiKey>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
  async filterKeyApi(offset: number, limit: number, params: any) {
    const queryBuilder = this.createQueryBuilder('api_key')
      .select([
        'api_key.id',
        'api_key.apiKey',
        'api_key.status',
        'api_key.createdAt',
        'api_key.updatedAt',
      ])
      .orderBy('api_key.createdAt', 'DESC')
      .limit(limit)
      .offset(offset);
    const queryCount = this.createQueryBuilder('api_key')
      .select(' Count (1) as Total')
      .orderBy('api_key.createdAt', 'DESC');
    if (params.status && params.status !== '') {
      queryBuilder.where('api_key.status = :status', {
        status: params.status,
      });
    }
    const apiKey = await queryBuilder.getMany();
    const apiKeyCountList = await queryCount.execute();
    return {apiKey, apiKeyCountList};
  }
}
