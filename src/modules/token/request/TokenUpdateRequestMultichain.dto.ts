import {ApiProperty} from '@nestjs/swagger';
import {IsIn, IsOptional} from 'class-validator';

export class TokenUpdateRequestMultichain {
  @ApiProperty({
    type: String,
    example: '0x8cB2a62E7dfe7557c0481ed6EC4A3b3Aed65eF1e',
  })
  public tokenAddress: string;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  public chainId: number;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  public decimal: number;
}
