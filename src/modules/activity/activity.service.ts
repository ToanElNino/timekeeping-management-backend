import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Transaction} from '../../database/entities';
import {Repository, getConnection} from 'typeorm';
import {PageOptionsDto} from '../../shared/Request/baseRequest.dto';
import {getArrayPaginationBuildTotal, getOffset} from '../../shared/Utils';
import {IPaginationOptions} from 'nestjs-typeorm-paginate';
import {PaginationResponse} from '../../config/rest/paginationResponse';
import {FilterTransactionRequest} from './request/filter-transaction.dto';
import {TransactionRepository} from './activity.repository';
@Injectable()
export class ActivityService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async listAllTransaction(
    pageOptions: PageOptionsDto,
    filter: FilterTransactionRequest
  ): Promise<PaginationResponse<Transaction>> {
    const offset = getOffset(pageOptions as IPaginationOptions);
    const limit = Number(pageOptions.limit);
    const {transactions, transactionsCountList} =
      await this.transactionRepository.activityFilter(offset, limit, filter);
    const {items, meta} = getArrayPaginationBuildTotal<Transaction>(
      transactions,
      transactionsCountList,
      pageOptions
    );

    return {
      results: items,
      pagination: meta,
    };
  }
}
