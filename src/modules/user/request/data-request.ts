import {ApiProperty} from '@nestjs/swagger';
import {IsEmail, IsOptional, IsString} from 'class-validator';
import {Causes} from '../../../config/exception/causes';

export class RequestData {
  @ApiProperty({
    type: String,
    example: 'username',
  })
  @IsString({message: JSON.stringify(Causes.USERNAME_STRING)})
  @IsOptional()
  username: string;

  @ApiProperty({
    type: String,
    example: 'example@gmail.com',
  })
  @IsEmail({}, {message: JSON.stringify(Causes.EMAIL_INVALID)})
  @IsOptional()
  email: string;

  @ApiProperty({
    type: String,
    example: 'wallet',
  })
  @IsOptional()
  @IsString({message: JSON.stringify(Causes.WALLET_STRING)})
  wallet: string;

  @ApiProperty({
    type: String,
    example: 'signature',
  })
  @IsOptional()
  @IsString({message: JSON.stringify(Causes.SIGNATURE_STRING)})
  signature: string;

  @ApiProperty({
    type: String,
    example: 'refresh_token',
  })
  @IsString({message: JSON.stringify(Causes.REFRESH_TOKEN_STRING)})
  @IsOptional()
  refreshToken: string;

  @ApiProperty({
    type: String,
    example: 'password',
  })
  @IsString({message: JSON.stringify(Causes.PASSWORD_STRING)})
  @IsOptional()
  password: string;
}
