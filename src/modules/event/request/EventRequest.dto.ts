/* eslint-disable @typescript-eslint/no-unused-vars */
import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsNumber, IsString} from 'class-validator';
import {Causes} from '../../../config/exception/causes';

export class EventRequest {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  @IsNotEmpty({message: JSON.stringify(Causes.MERCHANT_ID_EMPTY)})
  @IsNumber({}, {message: JSON.stringify(Causes.MERCHANT_ID_NUMBER)})
  merchantId: number;

  @ApiProperty({
    type: String,
    example: '0x8cB2a62E7dfe7557c0481ed6EC4A3b3Aed65eF1e',
  })
  @IsNotEmpty({message: JSON.stringify(Causes.WALLET_ADDRESS_EMPTY)})
  @IsString({message: JSON.stringify(Causes.WALLET_ADDRESS_STRING)})
  walletAddress: string;
}
