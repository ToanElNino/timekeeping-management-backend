import {BaseResponsePagination} from '../../../shared/response/baseResponse.dto';
import {ApiResponseProperty} from '@nestjs/swagger';
import {ChainResponse} from './ChainResponse.dto';

export class ChainBaseResponsePagination extends BaseResponsePagination {
  @ApiResponseProperty({
    type: [ChainResponse],
  })
  data: [ChainResponse];
}
