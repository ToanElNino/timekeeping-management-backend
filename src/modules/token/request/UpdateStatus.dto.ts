import {ApiProperty} from '@nestjs/swagger';
import {IsIn} from 'class-validator';

export class TokenUpdateStatus {
  @ApiProperty({
    type: String,
    example: 'ACTIVE',
    description: 'Status',
  })
  @IsIn(['ACTIVE', 'INACTIVE'])
  status: string;

  @ApiProperty({
    type: String,
    example: 'test',
    description: 'The reason',
  })
  reason: string;
}
