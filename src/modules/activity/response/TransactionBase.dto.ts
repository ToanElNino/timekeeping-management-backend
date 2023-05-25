import {BaseResponse} from '../../../shared/response/baseResponse.dto';
import {ApiResponseProperty} from '@nestjs/swagger';
import {TransactionResponse} from './TransactionResponse.dto';

export class TransactionBase extends BaseResponse {
  @ApiResponseProperty({
    type: [TransactionResponse],
  })
  data: [TransactionResponse];
}
