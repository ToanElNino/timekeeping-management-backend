import {ApiProperty, ApiResponseProperty} from '@nestjs/swagger';
import {BaseResponsePagination} from '../../../shared/response/baseResponse.dto';
import {ApiKeyResponse} from './api-key-response.dto';

export class ApiKeyPaginateResponseBase extends BaseResponsePagination {
  @ApiResponseProperty({
    type: [ApiKeyResponse],
  })
  data: [ApiKeyResponse];
}
