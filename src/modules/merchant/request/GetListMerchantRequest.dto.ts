/* eslint-disable @typescript-eslint/no-unused-vars */
import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {PageOptionsDto} from '../../../shared/Request/baseRequest.dto';
import {IsOptional, IsString, MaxLength} from 'class-validator';
import {Type} from 'class-transformer';

export class GetListMerchantRequest extends PageOptionsDto {
  @ApiProperty({
    type: String,
    example: 'lehuyaa',
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    example: 'ACTIVE',
  })
  @IsOptional()
  @IsString()
  status: string;
}
