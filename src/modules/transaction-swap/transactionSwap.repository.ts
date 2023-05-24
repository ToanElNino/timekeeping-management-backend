import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Token, Transaction, TransactionSwap} from 'src/database/entities';

@Injectable()
export class TransactionSwapRepository extends Repository<TransactionSwap> {
  constructor(
    @InjectRepository(TransactionSwap)
    repository: Repository<TransactionSwap>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
  async transactionSwapFilter(offset: number, limit: number, params: any) {
    const queryBuilder = this.createQueryBuilder('transaction_swap')
      .leftJoin(
        Transaction,
        'fromTxn',
        'transaction_swap.from_txn_hash = fromTxn.txn_hash'
      )
      .leftJoin(
        Transaction,
        'toTxn',
        'transaction_swap.to_txn_hash = toTxn.txn_hash'
      )
      .leftJoin(
        Token,
        'fromToken',
        'transaction_swap.from_token_address = fromToken.token_address'
      )
      .leftJoin(
        Token,
        'toToken',
        'transaction_swap.to_token_address = toToken.token_address'
      )
      .select(
        'transaction_swap.id, transaction_swap.status, transaction_swap.created_at as createdAt, ' +
          //from
          'transaction_swap.from_txn_hash as fromTxnHash, transaction_swap.from_chain_id as fromChainId, transaction_swap.from_token_address as fromTokenAddress,' +
          'transaction_swap.from_amount as fromAmount, fromToken.name as fromTokenName, fromToken.icon as fromTokenIcon, fromTxn.block_number as fromBlockNumber, ' +
          'fromTxn.block_timestamp as fromBlockTimestamp, fromTxn.txn_fee as fromTxnFee,' +
          'fromTxn.gas_limit as fromGasLimit, fromTxn.gas_price as fromGasPrice, ' +
          'fromTxn.from_address as fromFromAddress, fromTxn.to_address as fromToAddress, ' +
          //to
          'transaction_swap.to_txn_hash as toTxnHash, transaction_swap.to_chain_id as toChainId, transaction_swap.to_token_address as toTokenAddress,' +
          'transaction_swap.to_amount as toAmount, toToken.name as toTokenName, toToken.icon as toTokenIcon, toTxn.block_number as toBlockNumber, ' +
          'toTxn.block_timestamp as toBlockTimestamp, toTxn.txn_fee as toTxnFee, ' +
          'toTxn.gas_limit as toGasLimit, toTxn.gas_price as toGasPrice,' +
          'toTxn.from_address as toFromAddress, toTxn.to_address as toToAddress'
      )
      .orderBy('transaction_swap.created_at', 'DESC')
      .limit(limit)
      .offset(offset);
    const queryCount = this.createQueryBuilder('transaction_swap')
      .select(' Count (1) as Total')
      .orderBy('transaction_swap.created_at', 'DESC');
    if (params.status) {
      queryBuilder.andWhere('transaction_swap.status =:status', {
        status: params.status,
      });
      queryCount.andWhere('transaction_swap.status =:status', {
        status: params.status,
      });
    }

    const data = await queryBuilder.execute();
    const countData = await queryCount.execute();
    return {data, countData};
  }
}
