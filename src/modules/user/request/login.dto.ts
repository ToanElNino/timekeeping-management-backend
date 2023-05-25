import {ApiProperty} from '@nestjs/swagger';
import {IsEmail, IsNotEmpty} from 'class-validator';
import {Causes} from '../../../config/exception/causes';

export class Login {
  @ApiProperty({
    type: String,
    example: 'example@gmail.com',
  })
  @IsEmail({}, {message: JSON.stringify(Causes.EMAIL_INVALID)})
  email: string;

  @ApiProperty({
    type: String,
    example: 'password',
  })
  @IsNotEmpty({message: JSON.stringify(Causes.PASSWORD_EMPTY)})
  password: string;

  @ApiProperty({
    type: String,
    example: '12345678',
  })
  twofa: string;

  @ApiProperty({
    type: String,
    example: '123456',
  })
  emailCode: string;
}
