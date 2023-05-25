import {ApiProperty} from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import {Causes} from '../../../config/exception/causes';

export class Register {
  @ApiProperty({
    type: String,
    example: 'username',
  })
  @IsOptional()
  @IsString({message: JSON.stringify(Causes.USERNAME_STRING)})
  @MinLength(3, {message: JSON.stringify(Causes.USERNAME_MIN_LENGTH)})
  @MaxLength(256, {message: JSON.stringify(Causes.USERNAME_MAX_LENGTH)})
  username: string;

  @ApiProperty({
    type: String,
    example: 'example@gmail.com',
  })
  @IsNotEmpty({message: JSON.stringify(Causes.EMAIL_EMPTY)})
  @IsEmail({}, {message: JSON.stringify(Causes.EMAIL_INVALID)})
  @MaxLength(256, {message: JSON.stringify(Causes.EMAIL_TOO_LONG)})
  email: string;

  @ApiProperty({
    type: String,
    example: 'password',
  })
  @IsNotEmpty({message: JSON.stringify(Causes.PASSWORD_EMPTY)})
  @IsString({message: JSON.stringify(Causes.PASSWORD_STRING)})
  @MinLength(8, {message: JSON.stringify(Causes.PASSWORD_MIN_LENGTH)})
  @MaxLength(20, {message: JSON.stringify(Causes.PASSWORD_MAX_LENGTH)})
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: JSON.stringify(Causes.PASSWORD_MATCH_PATTERN),
  })
  password: string;

  @ApiProperty({
    type: String,
    example: 'wallet',
  })
  wallet: string;

  @ApiProperty({
    type: String,
    example: 'signature',
  })
  signature: string;
}
