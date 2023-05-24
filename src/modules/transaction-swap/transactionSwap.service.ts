import {Injectable} from '@nestjs/common';
import {Repository, getConnection} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Token, Transaction, TransactionSwap} from '../../database/entities';
import {IPaginationOptions} from 'nestjs-typeorm-paginate';
import {PaginationResponse} from 'src/config/rest/paginationResponse';
import {getArrayPaginationBuildTotal, getOffset} from 'src/shared/Utils';
import {TransactionSwapRepository} from './transactionSwap.repository';

@Injectable()
export class TransactionSwapService {
  constructor(private transactionSwapRepo: TransactionSwapRepository) {}

  async getListTransactionSwap(
    params,
    paginationOptions: IPaginationOptions
  ): Promise<PaginationResponse<TransactionSwap>> {
    const offset = getOffset(paginationOptions);
    const limit = Number(paginationOptions.limit);

    const {data, countData} =
      await this.transactionSwapRepo.transactionSwapFilter(
        offset,
        limit,
        params
      );
    const {items, meta} = getArrayPaginationBuildTotal<TransactionSwap>(
      data,
      countData,
      paginationOptions
    );
    return {
      results: items,
      pagination: meta,
    };
  }
}
