import {ApiProperty} from '@nestjs/swagger';

export class GetTransactionSwapResponse {
  @ApiProperty({type: Number, example: 1231})
  id: number;

  @ApiProperty({
    example:
      '0x38a503846fb927ef6f0b83a64bb96ef3311650da5faba1ab124d46ee49d901f8',
    type: String,
  })
  public fromTxnHash: string;

  @ApiProperty({type: Number, example: 6563454})
  public fromChainId: number;

  @ApiProperty({
    type: String,
    example: '0x388C818CA8B9251b393131C08a736A67ccB19297',
  })
  public fromTokenAddress: string;

  @ApiProperty({
    type: Number,
    example: 2342342,
  })
  public fromAmount: Number;

  @ApiProperty({
    type: String,
    example: 'BTC',
  })
  public fromTokenName: string;

  @ApiProperty({
    type: String,
    example:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1024px-Bitcoin.svg.png',
  })
  public fromTokenIcon: string;

  @ApiProperty({
    type: Number,
    example: 127874545,
  })
  public fromBlockNumber: Number;

  @ApiProperty({
    type: Number,
    example: 1681355502,
  })
  public fromBlockTimestamp: Number;

  @ApiProperty({
    type: Number,
    example: 0.000000678,
  })
  public fromTxnFee: Number;

  @ApiProperty({
    type: Number,
    example: 0.00000678,
  })
  public fromGasLimit: Number;

  @ApiProperty({
    type: Number,
    example: 0.00000678,
  })
  public fromGasPrice: Number;

  @ApiProperty({
    type: String,
    example:
      '0x38a503846fb927ef6f0b83a64bb96ef3311650da5faba1ab124d46ee49d901f8',
  })
  public fromFromAddress: string;

  @ApiProperty({
    type: String,
    example:
      '0x38a503846fb927ef6f0b83a64bb96ef3311650da5faba1ab124d46ee49d901f8',
  })
  public fromToAddress: string;
  ///to
  @ApiProperty({
    example:
      '0x38a503846fb927ef6f0b83a64bb96ef3311650da5faba1ab124d46ee49d901f8',
    type: String,
  })
  public toTxnHash: string;

  @ApiProperty({type: Number, example: 6563454})
  public toChainId: number;

  @ApiProperty({
    type: String,
    example: '0x388C818CA8B9251b393131C08a736A67ccB19297',
  })
  public toTokenAddress: string;

  @ApiProperty({
    type: Number,
    example: 2342342,
  })
  public toAmount: Number;

  @ApiProperty({
    type: String,
    example: 'ETH',
  })
  public toTokenName: string;

  @ApiProperty({
    type: String,
    example:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1024px-Bitcoin.svg.png',
  })
  public toTokenIcon: string;

  @ApiProperty({
    type: Number,
    example: 127874545,
  })
  public toBlockNumber: Number;

  @ApiProperty({
    type: Number,
    example: 1681355502,
  })
  public toBlockTimestamp: Number;

  @ApiProperty({
    type: Number,
    example: 0.000000678,
  })
  public toTxnFee: Number;

  @ApiProperty({
    type: Number,
    example: 0.00000678,
  })
  public toGasLimit: Number;

  @ApiProperty({
    type: Number,
    example: 0.00000678,
  })
  public toGasPrice: Number;

  @ApiProperty({
    type: String,
    example:
      '0x38a503846fb927ef6f0b83a64bb96ef3311650da5faba1ab124d46ee49d901f8',
  })
  public toFromAddress: string;

  @ApiProperty({
    type: String,
    example:
      '0x38a503846fb927ef6f0b83a64bb96ef3311650da5faba1ab124d46ee49d901f8',
  })
  public toToAddress: string;

  @ApiProperty({
    type: String,
    example: 'NEW',
  })
  public status: string;

  @ApiProperty({type: Number, example: 1681355502})
  public createdAt: number;

  @ApiProperty({type: Number, example: 1681355502})
  public updatedAt: number;
}
