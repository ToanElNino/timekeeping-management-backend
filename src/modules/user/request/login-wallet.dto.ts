import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsString, MaxLength, MinLength} from 'class-validator';
import {Causes} from '../../../config/exception/causes';

export class LoginWallet {
  @ApiProperty({
    type: String,
    example: 'wallet',
  })
  @IsNotEmpty({message: JSON.stringify(Causes.WALLET_EMPTY)})
  @IsString({message: JSON.stringify(Causes.WALLET_STRING)})
  @MinLength(6, {message: JSON.stringify(Causes.WALLET_MIN_LENGTH)})
  @MaxLength(100, {message: JSON.stringify(Causes.WALLET_MAX_LENGTH)})
  wallet: string;

  @ApiProperty({
    type: String,
    example: 'signature',
  })
  @IsNotEmpty({message: JSON.stringify(Causes.SIGNATURE_EMPTY)})
  @IsString({message: JSON.stringify(Causes.SIGNATURE_STRING)})
  @MinLength(6, {message: JSON.stringify(Causes.SIGNATURE_MIN_LENGTH)})
  @MaxLength(600, {message: JSON.stringify(Causes.SIGNATURE_MAX_LENGTH)})
  signature: string;

  @ApiProperty({
    type: String,
    example: '123456',
  })
  twofa: string;
}
