import {ApiPropertyOptional} from '@nestjs/swagger';
import {IsIn, IsNotEmpty, IsString} from 'class-validator';

export class KeyApiFilter {
  @ApiPropertyOptional({
    type: String,
    example: 'ACTIVE',
  })
  @IsString()
  @IsIn(['ACTIVE', 'INACTIVE', ''])
  status: string;
}
