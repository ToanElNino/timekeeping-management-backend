import {BaseResponsePagination} from '../../../shared/response/baseResponse.dto';
import {ApiResponseProperty} from '@nestjs/swagger';
import {GetEventResponse} from './EventResponse.dto';

export class EventBaseResponsePagination extends BaseResponsePagination {
  @ApiResponseProperty({
    type: [GetEventResponse],
  })
  data: [GetEventResponse];
}
