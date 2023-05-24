import {BaseResponse} from '../../../shared/response/baseResponse.dto';
import {ApiResponseProperty} from '@nestjs/swagger';
import {MerchantResponse} from './MerchantResponse.dto';

export class MerchantBaseResponse extends BaseResponse {
  @ApiResponseProperty({
    type: MerchantResponse,
  })
  data: MerchantResponse;
}
