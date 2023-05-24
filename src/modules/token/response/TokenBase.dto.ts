import {BaseResponse} from '../../../shared/response/baseResponse.dto';
import {ApiResponseProperty} from '@nestjs/swagger';
import {TokenResponse} from './TokenResponse.dto';

export class TokenBase extends BaseResponse {
  @ApiResponseProperty({
    type: [TokenResponse],
  })
  data: [TokenResponse];
}
