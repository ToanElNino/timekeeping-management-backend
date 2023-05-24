import {ApiProperty} from '@nestjs/swagger';
import {IsIn, IsOptional} from 'class-validator';

export class TransactionResponse {
  @ApiProperty({
    type: String,
    example: '0x8cB2a62E7dfe7557c0481ed6EC4A3b3Aed65eF1e',
  })
  public tokenAddress: string;

  @ApiProperty({
    type: String,
    example: '0x8cB2a62E7dfe7557c0481ed6EC4A3b3Aed65eF1eEC4A3b3Aed65eF1e',
  })
  public txnHash: string;

  @ApiProperty({
    type: Number,
    example: '1',
  })
  public chainId: string;

  @ApiProperty({
    type: Number,
    example: '1',
  })
  public amount: number;

  @ApiProperty({
    type: Number,
    example: '0x8cB2a62E7dfe7557c0481ed6EC4A3b3Aed65eF1e',
  })
  public fromAddress: string;

  @ApiProperty({
    type: Number,
    example: '0x8cB2a62E7dfe7557c0481ed6EC4A3b3Aed65eF1e',
  })
  public toAddress: string;

  @ApiProperty({
    type: Number,
    example: 'NEW',
  })
  @IsIn(['NEW', 'IN PROGRESS', 'SUCCESS', 'FAIL'])
  public status: string;

  @ApiProperty({
    type: Number,
    example: '123456789',
  })
  public blockNumber: number;

  @ApiProperty({
    type: Number,
    example: '123456789',
  })
  public blockTimestamp: number;

  @ApiProperty({
    type: Number,
    example: '1',
  })
  public txnFee: number;

  @ApiProperty({
    type: Number,
    example: '1',
  })
  public gasLimit: number;

  @ApiProperty({
    type: Number,
    example: '1',
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
