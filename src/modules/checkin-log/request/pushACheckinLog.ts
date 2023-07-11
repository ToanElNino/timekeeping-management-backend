import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsString, MaxLength, MinLength} from 'class-validator';
import {Causes} from 'src/config/exception/causes';

export class PushACheckinLogRequest {
  @ApiProperty({
    type: String,
  })
  public id: string;

  @ApiProperty({
    type: Number,
  })
  public tenantId: number;

  @ApiProperty({
    type: String,
  })
  public dayRecord: string;

  @ApiProperty({
    type: Number,
  })
  public timeRecordNumber: number;

  @ApiProperty({
    type: Number,
  })
  public userCheckinLogId: number;
}
