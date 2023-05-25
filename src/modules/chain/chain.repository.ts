import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Chain, Token} from 'src/database/entities';
import {CreateChainRequest} from './request/CreateChainRequest.dto';
import {nowInMillis} from 'src/shared/Utils';

@Injectable()
export class ChainRepository extends Repository<Chain> {
  constructor(
    @InjectRepository(Chain)
    repository: Repository<Chain>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
  async createChain(
    iconUrl: string | null,
    data: CreateChainRequest
  ): Promise<any> {
    const chain = new Chain();
    chain.chainName = data.chainName;
    chain.symbol = data.symbol;
    chain.id = data.id;
    chain.explorerEndpoint = data.explorerEndpoint;
    chain.scanApi = data.scanApi;
    chain.icon = iconUrl;
    chain.status = 'ACTIVE';
    chain.rpcEndpoint = data.rpcEndpoint;
    chain.createdAt = nowInMillis();
    chain.updatedAt = nowInMillis();
    return await this.save(chain);
  }

  async getListChain(offset: number, limit: number, filter: any) {
    const queryBuilder = this.createQueryBuilder('chain')
      .orderBy('chain.createdAt', 'DESC')
      .limit(limit)
      .offset(offset);
    const queryCount = this.createQueryBuilder('chain')
      .select(' Count (1) as Total')
      .orderBy('chain.createdAt', 'DESC');

    if (filter.keyWord && filter.keyWord !== '') {
      if (
        filter.keyWord &&
        filter.keyWord.includes('%') !== true &&
        filter.keyWord.includes('_') !== true
      ) {
        queryBuilder.andWhere(
          `chain.chainName like '%${filter.keyWord.trim()}%'`
        );
        queryCount.andWhere(
          `chain.chainName like '%${filter.keyWord.trim()}%'`
        );
      } else {
        queryBuilder.andWhere(
          `chain.chainName like '%!${filter.keyWord.trim()}%' ESCAPE '!'`
        );
        queryCount.andWhere(
          `chain.chainName like '%!${filter.keyWord.trim()}%' ESCAPE '!'`
        );
      }
    }

    if (filter.status) {
      queryBuilder.andWhere('status=:status', {
        status: filter.status,
      });
    }
    const data = await queryBuilder.getMany();
    const countData = await queryCount.execute();
    return {data, countData};
  }
}
