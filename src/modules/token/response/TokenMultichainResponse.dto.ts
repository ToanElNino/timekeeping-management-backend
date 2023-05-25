import {ApiProperty} from '@nestjs/swagger';
import {IsIn, IsOptional} from 'class-validator';

export class TokenMultichainResponse {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  public id: number;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  public chainId: number;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  public tokenId: number;

  @ApiProperty({
    type: String,
    example: '0x8cB2a62E7dfe7557c0481ed6EC4A3b3Aed65eF1e',
  })
  public tokenAddress: string;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  public decimal: number;

  @ApiProperty({
    type: Number,
    example: 123456789,
  })
  public createdAt: number;

  @ApiProperty({
    type: Number,
    example: 123456789,
  })
  public updatedAt: number;

  @ApiProperty({
    type: String,
    example: 'Ethereum',
  })
  public chainName: string;

  @ApiProperty({
    type: String,
    example: 'https://orbit-storage.s3.amazonaws.com/velo-orbit/image.png',
  })
  public icon: string;
}
