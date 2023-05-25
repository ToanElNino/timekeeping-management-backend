import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, MaxLength, MinLength} from 'class-validator';
import {Causes} from '../../../config/exception/causes';

export class PushNotificationFromEvent {
  @ApiProperty({
    type: Number,
    example: 9,
  })
  @IsNotEmpty()
  eventId: number;

  // @ApiProperty({
  //   type: Boolean,
  //   example: 1,
  //   default: true,
  // })
  // @IsNotEmpty()
  // isGlobal: boolean;
}
