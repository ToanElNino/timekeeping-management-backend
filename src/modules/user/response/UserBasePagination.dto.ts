import {BaseResponsePagination} from '../../../shared/response/baseResponse.dto';
import {ApiResponseProperty} from '@nestjs/swagger';
import {UserResponse} from './UserResponse.dto';

export class UserBaseResponsePagination extends BaseResponsePagination {
  @ApiResponseProperty({
    type: [UserResponse],
  })
  data: [UserResponse];
}
