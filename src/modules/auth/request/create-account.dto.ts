import {ApiProperty} from '@nestjs/swagger';
import {IsEmail, IsNotEmpty, IsOptional, IsString} from 'class-validator';
import {Causes} from '../../../config/exception/causes';

export class CreateAccountBody {
  @ApiProperty({
    type: String,
    example: 'toanquoc1',
  })
  username: string;

  @ApiProperty({
    type: String,
    example: '123qwe',
  })
  password: string;

  @ApiProperty({
    type: String,
    example: 'HUST',
  })
  companyCode: string;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  roleId: number;
}
