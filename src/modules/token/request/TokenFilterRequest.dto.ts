import {ApiPropertyOptional} from '@nestjs/swagger';
import {IsIn, IsOptional} from 'class-validator';

export class TokenFilterRequest {
  @ApiPropertyOptional({
    type: String,
    example: 'ACTIVE',
  })
  @IsOptional()
  @IsIn(['ACTIVE', 'INACTIVE', ''])
  public status: string;

  @ApiPropertyOptional({
    type: String,
    example: 'DEFAULT',
  })
  @IsOptional()
  @IsIn(['DEFAULT', 'CUSTOM', ''])
  public type: string;

  @ApiPropertyOptional({
    type: String,
    example: 'Ethereum',
  })
  public name: string;
}
