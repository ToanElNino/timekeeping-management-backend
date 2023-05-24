import {BaseResponse} from '../../../shared/response/baseResponse.dto';
import {ApiResponseProperty} from '@nestjs/swagger';
import {CreateSystemWalletResponse} from './create-system-wallet.response';

export class CreateSystemWalletBaseResponse extends BaseResponse {
  @ApiResponseProperty({
    type: CreateSystemWalletResponse,
  })
  data: CreateSystemWalletResponse;
}
