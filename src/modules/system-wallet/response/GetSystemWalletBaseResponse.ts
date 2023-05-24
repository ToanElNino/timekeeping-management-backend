import {BaseResponse} from '../../../shared/response/baseResponse.dto';
import {ApiResponseProperty} from '@nestjs/swagger';
import {CreateSystemWalletResponse} from './create-system-wallet.response';
import {GetSystemWalletResponse} from './get-system-wallet.response';

export class GetSystemWalletBaseResponse extends BaseResponse {
  @ApiResponseProperty({
    type: GetSystemWalletResponse,
  })
  data: GetSystemWalletResponse;
}
