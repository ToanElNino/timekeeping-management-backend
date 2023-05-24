import {ApiPropertyOptional} from '@nestjs/swagger';
import {Type} from 'class-transformer';
import {IsOptional, IsString, MaxLength} from 'class-validator';

export class UserWalletRequestDto {
  @ApiPropertyOptional({
    type: String,
    description: 'User wallet address',
  })
  @Type(() => String)
  @IsString()
  @MaxLength(256)
  @IsOptional()
  readonly userWallet?: string;
}
