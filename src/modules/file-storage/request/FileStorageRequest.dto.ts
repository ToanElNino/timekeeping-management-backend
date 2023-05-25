import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsString, MaxLength, MinLength} from 'class-validator';
import {Causes} from 'src/config/exception/causes';

export class FileStorageRequest {
  @ApiProperty({
    type: 'file',
    format: 'binary',
    required: false,
  })
  public file: any;
}
