import {BaseResponse} from '../../../shared/response/baseResponse.dto';
import {ApiResponseProperty} from '@nestjs/swagger';
import {FileStorageResponse} from './FileStorageResponse.dto';

export class FileStorageBaseResponse extends BaseResponse {
  @ApiResponseProperty({
    type: FileStorageResponse,
  })
  data: FileStorageResponse;
}
