import {ApiProperty} from '@nestjs/swagger';
import {IsIn, IsOptional} from 'class-validator';
import {TokenUpdateRequestMultichain} from './TokenUpdateRequestMultichain.dto';
export class TokenUpdateRequest {
  @ApiProperty({
    type: String,
    example: 'Ethereum',
  })
  public name: string;

  @ApiProperty({
    type: String,
    example: 'ETH',
  })
  public symbol: string;

  @ApiProperty({
    type: Boolean,
    example: true,
  })
  public isNativeToken: boolean;

  @ApiProperty({
    type: String,
    example: 'https:/localhost:3001/icon.png',
  })
  @IsOptional()
  public icon: string;

  @ApiProperty({
    type: [TokenUpdateRequestMultichain],
  })
  public multichain: [TokenUpdateRequestMultichain];
}
