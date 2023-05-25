import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {
  Config,
  CurrencyConfig,
  LatestBlock,
  Notification,
  SocketNotification,
  User,
} from '../../database/entities';
import {CommonModule} from '../common/common.module';
import {ScheduleModule} from '@nestjs/schedule';
import {WorkerManagerService} from './worker-manager.service';
import {NotificationModule} from '../notification/notification.module';
import {SocketService} from './socket.service';
import {NotificationService} from '../notification/notification.service';
import {MailService} from '../mail/mail.service';
import {JwtService} from '@nestjs/jwt';
import {S3Handler} from '../../shared/S3Handler';
import {TelegramService} from '../notification/telegram.service';
import {SocketNotificationService} from '../socket-notification/socket-notification.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LatestBlock,
      User,
      Notification,
      SocketNotification,
      Config,
      CurrencyConfig,
    ]),
    CommonModule,
    NotificationModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  exports: [TypeOrmModule, WorkerManagerService],
  providers: [
    WorkerManagerService,
    MailService,
    SocketService,
    NotificationService,
    JwtService,
    TelegramService,
    SocketNotificationService,
    S3Handler,
  ],
})
export class WorkerModule {}
