import {Module} from '@nestjs/common';
import {MailModule} from '../mail/mail.module';
import {NotificationService} from './notification.service';
import {TelegramService} from './telegram.service';
import {AdminModule} from '../admin/admin.module';
import {NotificationController} from './notification.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Event, Notification, User, UserDevice} from '../../database/entities';
import {JwtModule} from '@nestjs/jwt';
import {S3Handler} from '../../shared/S3Handler';
import {AuthModule} from '../auth/auth.module';
import {EventService} from '../event/event.service';
import {EventRepository} from '../event/event.repository';
@Module({
  imports: [
    AuthModule,
    MailModule,
    AdminModule,
    TypeOrmModule.forFeature([User, Notification, UserDevice]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    TypeOrmModule.forFeature([Event]),
  ],
  providers: [
    NotificationService,
    TelegramService,
    S3Handler,
    EventService,
    EventRepository,
  ],
  controllers: [NotificationController],
  exports: [NotificationService],
})
export class NotificationModule {}
