import {ApiProperty} from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import {Causes} from '../../../config/exception/causes';

export class RegisterWallet {
  @ApiProperty({
    type: String,
    example: 'example@gmail.com',
  })
  @IsEmail({}, {message: JSON.stringify(Causes.EMAIL_INVALID)})
  @MinLength(3, {message: JSON.stringify(Causes.EMAIL_TOO_SHORT)})
  @MaxLength(256, {message: JSON.stringify(Causes.EMAIL_TOO_LONG)})
  email: string;

  @ApiProperty({
    type: String,
    example: 'username',
  })
  @IsNotEmpty({message: JSON.stringify(Causes.USERNAME_EMPTY)})
  @IsString({message: JSON.stringify(Causes.USERNAME_STRING)})
  @MinLength(3, {message: JSON.stringify(Causes.USERNAME_MIN_LENGTH)})
  @MaxLength(256, {message: JSON.stringify(Causes.USERNAME_MAX_LENGTH)})
  @Matches(/^[a-z0-9]+$/i, {
    message: JSON.stringify(Causes.USERNAME_MATCH_PATTERN),
  })
  username: string;

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
    example: 'password',
  })
  @IsNotEmpty({message: JSON.stringify(Causes.PASSWORD_EMPTY)})
  @IsString()
  @MinLength(8)
  @MaxLength(30)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;
}
