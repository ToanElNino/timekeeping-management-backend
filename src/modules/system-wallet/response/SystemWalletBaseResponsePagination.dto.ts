import {BaseResponsePagination} from '../../../shared/response/baseResponse.dto';
import {ApiResponseProperty} from '@nestjs/swagger';
import {GetSystemWalletResponse} from './get-system-wallet.response';

export class SystemWalletBaseResponsePagination extends BaseResponsePagination {
  @ApiResponseProperty({
    type: [GetSystemWalletResponse],
  })
  data: [GetSystemWalletResponse];
}
