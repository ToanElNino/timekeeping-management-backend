import {ApiProperty} from '@nestjs/swagger';
import {IsOptional} from 'class-validator';

export class CreateTenantBody {
  @ApiProperty({
    type: String,
    example: 'Bach khoa',
  })
  name: string;

  @ApiProperty({
    type: String,
    example: 'HUST',
  })
  code: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  public iconFile?: any;
}
