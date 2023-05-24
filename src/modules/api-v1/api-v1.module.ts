import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ApiV1Service} from './api-v1.service';
import {ApiV1Controller} from './api-v1.controller';
import {Admin, ApiKey, Notification, User} from '../../database/entities';
import {MailService} from '../mail/mail.service';
import {JwtModule} from '@nestjs/jwt';
import {CommonModule} from '../common/common.module';
import {SocketService} from '../worker/socket.service';
import {SingleSignOnService} from '../user/sso.service';
import {TwoFactorAuthenticationService} from '../user/twoFactorAuthentication.service';
import {S3Handler} from '../../shared/S3Handler';
import {UserService} from '../user/user.service';
import {AuthModule} from '../auth/auth.module';
import {AdminService} from '../admin/admin.service';
import {AdminRepository} from '../admin/admin.repository';
import {UserRepository} from '../user/user.repository';
import {ApiKeyRepository} from './api-key.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Notification, Admin, ApiKey]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    AuthModule,
    CommonModule,
    ApiV1Module,
  ],
  providers: [
    ApiV1Service,
    MailService,
    AdminService,
    AdminRepository,
    UserService,
    UserRepository,
    ApiKeyRepository,
  ],
  controllers: [ApiV1Controller],
})
export class ApiV1Module {}
