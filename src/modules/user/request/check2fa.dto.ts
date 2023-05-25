import {ApiProperty} from '@nestjs/swagger';
import {IsEmail, IsNotEmpty} from 'class-validator';
import {Causes} from '../../../config/exception/causes';

export class Check2fa {
  @ApiProperty({
    type: String,
    example: '123456',
  })
  @IsNotEmpty({message: JSON.stringify(Causes.TWOFA_CODE_IS_EMPTY)})
  twofa: string;
}
