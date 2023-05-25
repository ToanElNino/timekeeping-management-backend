import {BaseResponse} from '../../../shared/response/baseResponse.dto';
import {ApiResponseProperty} from '@nestjs/swagger';
import {CreateEventResponse} from './CreateEventResponse.dto';

export class UpdateEventBaseResponse extends BaseResponse {
  @ApiResponseProperty({
    type: CreateEventResponse,
  })
  data: CreateEventResponse;
}
