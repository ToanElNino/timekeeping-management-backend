import {ApiProperty} from '@nestjs/swagger';
import {IsIn, IsNotEmpty, IsNumber, IsString} from 'class-validator';

export class UpdateStatusApi {
  @ApiProperty({
    type: String,
    example: 'ACTIVE',
  })
  @IsString()
  @IsIn(['ACTIVE', 'INACTIVE'])
  status: string;
}
