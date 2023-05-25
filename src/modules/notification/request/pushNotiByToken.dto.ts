import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, MaxLength, MinLength} from 'class-validator';
import {Causes} from '../../../config/exception/causes';

export class PushNotificationByToken {
  @ApiProperty({
    type: String,
    example:
      'cYCO8SRbS_mEkkmFNAUGjW:APA91bFrm4MYZ2uGQgO4Ayx57MkTIA3dPtzvbkFDR7YRqdqlBXRX8VaTUEH4Tp2doUk_KxY5HNLsRk2e9TYJhXnMDvefprshL1fkeIzYwQlw0gN2lahh0ChfHntM366xIonMtQVpi9mq',
  })
  @IsNotEmpty({message: JSON.stringify(Causes.FIREBASE_TOKEN_EMPTY)})
  token: string;

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
