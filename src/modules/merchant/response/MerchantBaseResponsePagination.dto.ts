import {BaseResponsePagination} from '../../../shared/response/baseResponse.dto';
import {ApiResponseProperty} from '@nestjs/swagger';
import {MerchantResponse} from './MerchantResponse.dto';

export class MerchantBaseResponsePagination extends BaseResponsePagination {
  @ApiResponseProperty({
    type: [MerchantResponse],
  })
  data: [MerchantResponse];
}
