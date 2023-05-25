import {ApiProperty} from '@nestjs/swagger';
import {IsEmail, IsNotEmpty, IsOptional, IsString} from 'class-validator';
import {Causes} from '../../../config/exception/causes';

export class AdminLogin {
  @ApiProperty({
    type: String,
    example: 'superadmin',
  })
  @IsOptional()
  @IsString({message: JSON.stringify(Causes.USERNAME_STRING)})
  username: string;

  @ApiProperty({
    type: String,
    example: 'superadmin@var-meta.com',
  })
  @IsOptional()
  @IsEmail({}, {message: JSON.stringify(Causes.EMAIL_INVALID)})
  email: string;

  @ApiProperty({
    type: String,
    example: 'Password@123',
  })
  @IsNotEmpty({message: JSON.stringify(Causes.PASSWORD_EMPTY)})
  password: string;
}
