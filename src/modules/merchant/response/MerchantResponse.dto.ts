/* eslint-disable @typescript-eslint/no-unused-vars */
import {ApiProperty} from '@nestjs/swagger';

export class MerchantResponse {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  id: number;

  @ApiProperty({
    type: String,
    example: 'Merchant 1',
  })
  name: string;

  @ApiProperty({
    type: String,
    example: 'https://localhost:3001/avatar.jpg',
  })
  avatar: string;

  @ApiProperty({
    type: Number,
    example: 21.0377,
  })
  longitude: number;

  @ApiProperty({
    type: Number,
    example: 105.834,
  })
  latitude: number;

  @ApiProperty({
    type: String,
    example: '0x93902d47bE75950242D2557588cF45F0D3da2812',
  })
  walletAddress: string;

  @ApiProperty({
    type: String,
    example: 'Vietnam',
  })
  address: string;

  @ApiProperty({
    type: Boolean,
    example: 'true',
  })
  isActive: boolean;

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
