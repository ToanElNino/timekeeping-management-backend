import {ApiProperty} from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import {Causes} from '../../../config/exception/causes';

export class UpdateProfile {
  @ApiProperty({
    type: String,
    example: 'nhatbka',
    description: 'username',
  })
  @IsOptional()
  @IsString({message: JSON.stringify(Causes.USERNAME_STRING)})
  @MinLength(3, {message: JSON.stringify(Causes.USERNAME_MIN_LENGTH)})
  @MaxLength(256, {message: JSON.stringify(Causes.USERNAME_MAX_LENGTH)})
  username: string;

  @ApiProperty({
    type: String,
    example: 'full_name',
  })
  @IsOptional()
  @IsString({message: JSON.stringify(Causes.FULL_NAME_STING)})
  @MinLength(4, {message: JSON.stringify(Causes.FULL_NAME_MIN_LENGTH)})
  @MaxLength(64, {message: JSON.stringify(Causes.FULL_NAME_MAX_LENGTH)})
  fullName: string;
}
