import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {SystemWallet} from 'src/database/entities';

@Injectable()
export class SystemWalletRepository extends Repository<SystemWallet> {
  constructor(
    @InjectRepository(SystemWallet)
    repository: Repository<SystemWallet>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
  async systemWalletFilter(offset: number, limit: number, params: any) {
    const queryBuilder = this.createQueryBuilder('system_wallet')
      .select([
        'system_wallet.systemWallet',
        'system_wallet.chainId',
        'system_wallet.name',
        'system_wallet.status',
        'system_wallet.createdAt',
      ])
      .orderBy('system_wallet.createdAt', 'DESC')
      .limit(limit)
      .offset(offset);
    const queryCount = this.createQueryBuilder('system_wallet')
      .select(' Count (1) as Total')
      .orderBy('system_wallet.createdAt', 'DESC');
    if (params.name && params.name !== '') {
      if (
        params.name &&
        params.name.includes('%') !== true &&
        params.name.includes('_') !== true
      ) {
        queryBuilder.andWhere(
          `system_wallet.name like '%${params.name.trim()}%'`
        );
        queryCount.andWhere(
          `system_wallet.name like '%${params.name.trim()}%'`
        );
      } else {
        queryBuilder.andWhere(
          `system_wallet.name like '%!${params.name.trim()}%' ESCAPE '!'`
        );
        queryCount.andWhere(
          `system_wallet.name like '%!${params.name.trim()}%' ESCAPE '!'`
        );
      }
    }
    if (params.status) {
      queryBuilder.andWhere('system_wallet.status =:status', {
        status: params.status,
      });
      queryCount.andWhere('system_wallet.status =:status', {
        status: params.status,
      });
    }

    const data = await queryBuilder.getMany();
    const countData = await queryCount.execute();
    return {data, countData};
  }
}
