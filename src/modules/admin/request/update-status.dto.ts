import {ApiProperty} from '@nestjs/swagger';
import {IsIn, IsNotEmpty, IsNumber, IsString} from 'class-validator';
import {AdminStatus} from '../../../shared/enums';
import {Causes} from '../../../config/exception/causes';

export class UpdateStatus {
  @ApiProperty({
    type: String,
    example: 1,
    description: 'ACTIVE or INACTIVE ',
  })
  @IsNotEmpty({message: JSON.stringify(Causes.STATUS_EMPTY)})
  @IsIn(['ACTIVE', 'INACTIVE'])
  status: string;

  @ApiProperty({
    type: String,
    example: 'test',
    description: 'The reason to freeze/unfreeze this account',
  })
  @IsNotEmpty({message: JSON.stringify(Causes.REASON_EMPTY)})
  @IsString({message: JSON.stringify(Causes.REASON_STRING)})
  reason: string;
}
