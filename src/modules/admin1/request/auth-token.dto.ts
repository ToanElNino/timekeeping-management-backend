import {ApiProperty} from '@nestjs/swagger';
import {IsEmail, IsOptional, IsString} from 'class-validator';
import {Causes} from '../../../config/exception/causes';

export class AuthToken {
  @ApiProperty({
    type: String,
    example: 'refresh_token',
  })
  @IsString({message: JSON.stringify(Causes.REFRESH_TOKEN_STRING)})
  @IsOptional()
  refreshToken: string;
}
