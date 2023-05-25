import {BaseResponsePagination} from '../../../shared/response/baseResponse.dto';
import {ApiResponseProperty} from '@nestjs/swagger';
import {GetTransactionSwapResponse} from './get-transaction-swap.response.dto';

export class TransactionSwapBaseResponsePagination extends BaseResponsePagination {
  @ApiResponseProperty({
    type: [GetTransactionSwapResponse],
  })
  data: [GetTransactionSwapResponse];
}
