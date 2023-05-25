import {BaseResponsePagination} from '../../../shared/response/baseResponse.dto';
import {ApiResponseProperty} from '@nestjs/swagger';
import {ActivityResponse} from './ActivityResponse.dto';

export class ActivityBaseResponsePagination extends BaseResponsePagination {
  @ApiResponseProperty({
    type: [ActivityResponse],
  })
  data: [ActivityResponse];
}
