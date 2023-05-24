/* eslint-disable @typescript-eslint/no-unused-vars */
import {ApiProperty} from '@nestjs/swagger';

export class UserResponse {
  @ApiProperty({
    type: String,
    example: '0x93902d47bE75950242D2557588cF45F0D3da2812',
  })
  userWallet: string;

  @ApiProperty({
    type: String,
    example: 'AHYfdkjOPd',
  })
  public referralCode: string;

  @ApiProperty({
    type: String,
    example: 'account2023',
  })
  public accountName: string;

  @ApiProperty({
    type: String,
    example: 'AHYfdkjOPd',
  })
  public referBy: string;

  @ApiProperty({
    type: String,
    example: {},
  })
  public configBody: string;

  @ApiProperty({
    type: String,
    example: '0x93902d47bE7595024k0857588cF45F0D3da2812',
  })
  public defaultCurrency: string;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  public defaultChainId: number;

  @ApiProperty({
    type: String,
    example: 'ACTIVE',
  })
  public status: string;

  @ApiProperty({
    type: String,
    example: '1681203432781',
  })
  createdAt: string;

  @ApiProperty({
    type: String,
    example: '1681203432781',
  })
  updatedAt: string;
}
