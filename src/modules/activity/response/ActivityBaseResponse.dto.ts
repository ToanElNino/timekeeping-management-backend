import {BaseResponse} from '../../../shared/response/baseResponse.dto';
import {ApiResponseProperty} from '@nestjs/swagger';
import {ActivityResponse} from './ActivityResponse.dto';

export class ActivityBaseResponse extends BaseResponse {
  @ApiResponseProperty({
    type: ActivityResponse,
  })
  data: ActivityResponse;
}
