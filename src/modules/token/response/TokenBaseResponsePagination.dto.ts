import {BaseResponsePagination} from '../../../shared/response/baseResponse.dto';
import {ApiResponseProperty} from '@nestjs/swagger';
import {TokenResponse} from './TokenResponse.dto';

export class TokenBaseResponsePagination extends BaseResponsePagination {
  @ApiResponseProperty({
    type: [TokenResponse],
  })
  data: [TokenResponse];
}
