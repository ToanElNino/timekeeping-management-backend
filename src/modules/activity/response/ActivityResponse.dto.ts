import {ApiProperty} from '@nestjs/swagger';
import {IsOptional} from 'class-validator';

export class ActivityResponse {
  @ApiProperty({
    type: String,
    example:
      '0xf5ba016abb5684f7ebf9305de3625exfdcfcf7eb061922d2661d8f4286420898',
  })
  public txnHash: string;

  @ApiProperty({
    type: Number,
    example: '1',
  })
  public chainId: string;

  @ApiProperty({
    type: Number,
    example: '1.2222',
  })
  public amount: number;

  @ApiProperty({
    type: String,
    example: '0x8f7116CA03AEB485ddd0E2EdD3Faa73bfB232538',
  })
  public tokenAddress: string;

  @ApiProperty({
    type: String,
    example: '0x8f7116CA03AEB485ddd0E2EdD3Faa73bfB232538',
  })
  public fromAddress: string;

  @ApiProperty({
    type: String,
    example: '0x8f7116CA03AEB485ddd0E2EdD3Faa73bfB232538',
  })
  public toAddress: string;

  @ApiProperty({
    type: String,
    example: 'SUCCESS',
  })
  @IsOptional()
  public status: string;

  @ApiProperty({
    type: Number,
    example: '34476787',
  })
  public blockNumber: number;

  @ApiProperty({
    type: String,
    example: '1681355502',
  })
  public blockTimestamp: string;

  @ApiProperty({
    type: Number,
    example: '0.123134',
  })
  public txnFee: number;

  @ApiProperty({
    type: Number,
    example: '21000',
  })
  public gasLimit: number;

  @ApiProperty({
    type: Number,
    example: '0.123134',
  })
  public gasPrice: number;

  @ApiProperty({
    type: String,
    example: '1681355502',
  })
  public createdAt: string;

  @ApiProperty({
    type: String,
    example: '1681355502',
  })
  public updatedAt: number;
}
