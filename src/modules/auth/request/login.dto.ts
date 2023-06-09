import {ApiProperty} from '@nestjs/swagger';
import {IsEmail, IsNotEmpty, IsOptional, IsString} from 'class-validator';
import {Causes} from '../../../config/exception/causes';

export class LoginBody {
  @ApiProperty({
    type: String,
    example: 'toanquoc1',
  })
  username: string;

  @ApiProperty({
    type: String,
    example: 'Pa@superadmin',
  })
  password: string;

  @ApiProperty({
    type: String,
    example: 'HUST',
  })
  companyCode: string;
}
