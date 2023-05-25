import {FileUploadBaseRequest} from './../../../shared/Request/fileUploadBase.dto';

import {ApiProperty} from '@nestjs/swagger';

export class FileUploadRequest extends FileUploadBaseRequest {
  @ApiProperty({type: 'string'})
  username: string;

  @ApiProperty({type: 'string'})
  bio: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  avatar: any;

  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  background: any;
}
