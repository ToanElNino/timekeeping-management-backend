import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {IsNotEmpty, IsString, MaxLength, MinLength} from 'class-validator';
import {Causes} from 'src/config/exception/causes';

export class UpdateDepartmentRequest {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  public id: number;
  @ApiProperty({
    type: Number,
    example: 1,
  })
  public tenantId: number;

  @ApiProperty({
    type: String,
    example: 'Back office',
  })
  public name: string;

  @ApiProperty({
    type: String,
    example: 'P.405',
  })
  public address: string;

  @ApiPropertyOptional({
    type: String,
  })
  public description: string;
}
