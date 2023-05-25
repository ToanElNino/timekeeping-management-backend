import {ApiProperty} from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import {Causes} from '../../../config/exception/causes';

export class Update {
  @ApiProperty({
    type: String,
    example: 'bio',
  })
  @IsString({message: JSON.stringify(Causes.BIO_STRING)})
  @MaxLength(1000, {message: JSON.stringify(Causes.BIO_TOO_LONG)})
  @IsOptional()
  bio: string;

  @ApiProperty({
    type: String,
    example: 'username',
  })
  @IsNotEmpty({message: JSON.stringify(Causes.USERNAME_EMPTY)})
  @IsString({message: JSON.stringify(Causes.USERNAME_STRING)})
  @MinLength(3, {message: JSON.stringify(Causes.USERNAME_MIN_LENGTH)})
  @MaxLength(256, {message: JSON.stringify(Causes.USERNAME_MAX_LENGTH)})
  username: string;
}
