import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {IsNotEmpty, IsString, MaxLength, MinLength} from 'class-validator';
import {Causes} from 'src/config/exception/causes';

export class AdminChangePasswordBody {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  public tenantId: number;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  public accountId: number;

  @ApiProperty({
    type: String,
    example: '123qwe',
  })
  public newPassword: string;
}

export class UserChangePasswordBody {
  @ApiProperty({
    type: String,
    example: '123qwe',
  })
  public oldPassword: string;

  @ApiProperty({
    type: String,
    example: '12345678',
  })
  public newPassword: string;
}
