import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, MaxLength, MinLength} from 'class-validator';
import {Causes} from '../../../config/exception/causes';

export class PushNotificationByUserWallet {
  @ApiProperty({
    type: String,
    example: '0x1ABC7154748D1CE5144478CDEB574AE244B939B5',
  })
  @IsNotEmpty({message: JSON.stringify(Causes.FIREBASE_TOKEN_EMPTY)})
  userWallet: string;

  @ApiProperty({
    type: String,
    example: 'New update',
  })
  @IsNotEmpty({message: JSON.stringify(Causes.TITLE_FB_NOTIFICATION_EMPTY)})
  @MinLength(3, {
    message: JSON.stringify(Causes.TITLE_FB_NOTIFICATION_MIN_LENGTH),
  })
  @MaxLength(50, {
    message: JSON.stringify(Causes.TITLE_FB_NOTIFICATION_MAX_LENGTH),
  })
  title: string;

  @ApiProperty({
    type: String,
    example: 'Body notification',
  })
  @MinLength(3, {
    message: JSON.stringify(Causes.BODY_FB_NOTIFICATION_MIN_LENGTH),
  })
  @MaxLength(256, {
    message: JSON.stringify(Causes.BODY_FB_NOTIFICATION_MAX_LENGTH),
  })
  @IsNotEmpty({message: JSON.stringify(Causes.BODY_FB_NOTIFICATION_EMPTY)})
  body: string;
}
