import {BaseResponse} from '../../../shared/response/baseResponse.dto';
import {ApiResponseProperty} from '@nestjs/swagger';
import {UserResponse} from './UserResponse.dto';

export class UserBaseResponse extends BaseResponse {
  @ApiResponseProperty({
    type: UserResponse,
  })
  data: UserResponse;
}
