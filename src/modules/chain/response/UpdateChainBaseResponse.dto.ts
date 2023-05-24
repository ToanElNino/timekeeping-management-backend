import {BaseResponse} from '../../../shared/response/baseResponse.dto';
import {ApiResponseProperty} from '@nestjs/swagger';
import {ChainBaseResponse} from './ChainBaseResponse.dto';

export class UpdateChainBaseResponse extends BaseResponse {
  @ApiResponseProperty({
    type: ChainBaseResponse,
  })
  data: ChainBaseResponse;
}
