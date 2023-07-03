import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {IsNotEmpty, IsString, MaxLength, MinLength} from 'class-validator';
import {Causes} from 'src/config/exception/causes';

export class CreateAdminRequest {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  public tenantId: number;

  @ApiProperty({
    type: String,
    example: 'toannguyen',
  })
  public username: string;

  @ApiProperty({
    type: String,
    example: '123qwe',
  })
  public password: string;

  @ApiPropertyOptional({
    type: Number,
  })
  public roleId: number;
}
