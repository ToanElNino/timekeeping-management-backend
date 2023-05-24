import {Module} from '@nestjs/common';
import {AdminModule} from '../admin/admin.module';
import {UserModule} from '../user/user.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Admin, SocketNotification, User} from '../../database/entities';
import {JwtModule} from '@nestjs/jwt';
import {AdminService} from '../admin/admin.service';

import {SocketNotificationService} from './socket-notification.service';
import {SocketNotificationController} from './socket-notification.controller';
import {S3Handler} from '../../shared/S3Handler';
import {UserService} from '../user/user.service';
import {AdminRepository} from '../admin/admin.repository';
import {UserRepository} from '../user/user.repository';
@Module({
  imports: [
    AdminModule,
    UserModule,
    TypeOrmModule.forFeature([User, Admin, SocketNotification]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  providers: [
    AdminService,
    AdminRepository,
    UserService,
    UserRepository,
    SocketNotificationService,
  ],
  controllers: [SocketNotificationController],
  exports: [SocketNotificationService],
})
export class SocketNotificationModule {}
