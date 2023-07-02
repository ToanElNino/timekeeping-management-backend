import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {IsNotEmpty, IsString, MaxLength, MinLength} from 'class-validator';
import {Causes} from 'src/config/exception/causes';

export class DeleteDepartmentRequest {
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
}
