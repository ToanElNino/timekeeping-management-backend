import {ApiPropertyOptional} from '@nestjs/swagger';
import {Type} from 'class-transformer';
import {IsOptional, IsString, MaxLength} from 'class-validator';

export class FilterTransactionRequest {
  @ApiPropertyOptional({
    type: String,
    description: 'token address',
  })
  @Type(() => String)
  @IsString()
  @MaxLength(256)
  @IsOptional()
  tokenAddress?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'type',
  })
  @Type(() => String)
  @IsString()
  @MaxLength(256)
  @IsOptional()
  type?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'chainId',
  })
  @Type(() => String)
  @IsString()
  @MaxLength(256)
  @IsOptional()
  chainId?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'startTime',
  })
  @Type(() => String)
  @IsString()
  @MaxLength(256)
  @IsOptional()
  startTime?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'endTime',
  })
  @Type(() => String)
  @IsString()
  @MaxLength(256)
  @IsOptional()
  endTime?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'walletAddresss',
  })
  @Type(() => String)
  @IsString()
  @MaxLength(256)
  @IsOptional()
  walletAddress?: string;
}
