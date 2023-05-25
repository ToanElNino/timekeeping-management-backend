/* eslint-disable @typescript-eslint/no-unused-vars */
import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsNumber, IsString} from 'class-validator';

export class CreateMerchantRequest {
  @ApiProperty({
    type: String,
    example: 'lehuyaa',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    example:
      'https://media.vov.vn/sites/default/files/styles/large/public/2021-02/1_133.jpg',
  })
  @IsNotEmpty()
  @IsString()
  avatar: string;

  @ApiProperty({
    type: Number,
    example: 21.0377,
  })
  @IsNotEmpty()
  @IsNumber()
  longitude: number;

  @ApiProperty({
    type: Number,
    example: 105.834,
  })
  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @ApiProperty({
    type: String,
    example: '0x93902d47bE75950242D2557588cF45F0D3da2812',
  })
  @IsNotEmpty()
  @IsString()
  merchant_wallet: string;

  @ApiProperty({
    type: String,
    example: '82 Duy Tan',
  })
  @IsNotEmpty()
  @IsString()
  address: string;
}
