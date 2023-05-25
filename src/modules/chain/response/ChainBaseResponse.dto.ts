import {BaseResponse} from '../../../shared/response/baseResponse.dto';
import {ApiResponseProperty} from '@nestjs/swagger';
import {ChainResponse} from './ChainResponse.dto';

export class ChainBaseResponse extends BaseResponse {
  @ApiResponseProperty({
    type: ChainResponse,
  })
  data: ChainResponse;
}
