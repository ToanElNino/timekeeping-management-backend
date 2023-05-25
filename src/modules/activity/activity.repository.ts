import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Transaction} from 'src/database/entities';

@Injectable()
export class TransactionRepository extends Repository<Transaction> {
  constructor(
    @InjectRepository(Transaction)
    repository: Repository<Transaction>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
  async activityFilter(offset: number, limit: number, params: any) {
    const queryBuilder = await this.createQueryBuilder('transaction')
      .select([
        'transaction.id',
        'transaction.txnHash',
        'transaction.chainId',
        'transaction.amount',
        'transaction.tokenAddress',
        'transaction.fromAddress',
        'transaction.toAddress',
        'transaction.status',
        'transaction.blockNumber',
        'transaction.blockTimestamp',
        'transaction.txnFee',
        'transaction.gasLimit',
        'transaction.gasPrice',
        'transaction.createdAt',
        'transaction.updatedAt',
      ])
      .orderBy('transaction.createdAt', 'DESC')
      .limit(limit)
      .offset(offset);
    const queryCount = this.createQueryBuilder('transaction')
      .select(' Count (1) as Total')
      .orderBy('transaction.createdAt', 'DESC');

    if (params.tokenAddress) {
      queryBuilder.andWhere('transaction.tokenAddress=:tokenAddress', {
        tokenAddress: params.tokenAddress,
      });
    }

    if (params.chainId) {
      queryBuilder.andWhere('transaction.chainId=:chainId', {
        chainId: params.chainId,
      });
    }

    const transactions = await queryBuilder.getMany();
    const transactionsCountList = await queryCount.execute();

    return {transactions, transactionsCountList};
  }
}
