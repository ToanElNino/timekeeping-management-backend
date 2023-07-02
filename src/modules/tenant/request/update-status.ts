import {ApiProperty} from '@nestjs/swagger';
import {IsIn, IsNotEmpty} from 'class-validator';

export class UpdateStatusTenantBody {
  @ApiProperty({
    type: String,
    example: 'ACTIVE',
    description: 'Status',
  })
  @IsNotEmpty()
  @IsIn(['ACTIVE', 'INACTIVE'])
  status: string;
}
