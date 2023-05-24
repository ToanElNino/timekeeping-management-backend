import {ApiProperty, ApiResponseProperty} from '@nestjs/swagger';
import {BaseResponse} from '../../../shared/response/baseResponse.dto';
import {ApiKeyResponse} from './api-key-response.dto';

export class ApiKeyResponseBase extends BaseResponse {
  @ApiResponseProperty({
    type: ApiKeyResponse,
  })
  data: ApiKeyResponse;
}
