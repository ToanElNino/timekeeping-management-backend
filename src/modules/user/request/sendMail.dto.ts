import {ApiProperty} from '@nestjs/swagger';
import {IsEmail, IsNotEmpty, MaxLength} from 'class-validator';
import {Causes} from '../../../config/exception/causes';

export class reSendMail {
  @ApiProperty({
    type: String,
    example: 'example@gmail.com',
  })
  @IsNotEmpty({message: JSON.stringify(Causes.EMAIL_EMPTY)})
  @IsEmail({}, {message: JSON.stringify(Causes.EMAIL_INVALID)})
  @MaxLength(256, {message: JSON.stringify(Causes.EMAIL_TOO_LONG)})
  email: string;
}
