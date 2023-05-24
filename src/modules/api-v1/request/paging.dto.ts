import {ApiProperty} from '@nestjs/swagger';
import {IsNumber, IsOptional, Max, Min} from 'class-validator';

export class PagingDto {
  @ApiProperty({default: 1, required: false})
  @IsOptional()
  page: number;

  @ApiProperty({default: 5, required: false})
  @IsOptional()
  limit: number;
}
