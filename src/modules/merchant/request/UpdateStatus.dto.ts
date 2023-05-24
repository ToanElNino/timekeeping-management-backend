/* eslint-disable @typescript-eslint/no-unused-vars */
import {ApiProperty} from '@nestjs/swagger';
import {IsIn, IsNotEmpty, IsNumber} from 'class-validator';
import {AdminStatus} from '../../../shared/enums';
import {Causes} from '../../../config/exception/causes';

export class UpdateStatusRequest {
  @ApiProperty({
    type: Number,
    example: 1,
    description: '1 -> ACTIVE; 2 -> INACTIVE',
  })
  @IsNotEmpty({message: JSON.stringify(Causes.STATUS_EMPTY)})
  @IsNumber({}, {message: JSON.stringify(Causes.STATUS_NUMBER)})
  @IsIn([AdminStatus.ACTIVE, AdminStatus.FREEZED], {
    message: JSON.stringify(Causes.STATUS_STRICT),
  })
  status: number;
}
