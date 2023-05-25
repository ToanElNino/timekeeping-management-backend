import {Module} from '@nestjs/common';
import {UserController} from './user.controller';
import {PassportModule} from '@nestjs/passport';
import {JwtModule} from '@nestjs/jwt';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Admin, User} from '../../database/entities';
import {TwoFactorAuthenticationService} from './twoFactorAuthentication.service';
import {UserService} from './user.service';
import {MailModule} from '../mail/mail.module';
import {CommonModule} from '../common/common.module';
import {SingleSignOnService} from './sso.service';
import {S3Handler} from '../../shared/S3Handler';
import {AdminRepository} from '../admin/admin.repository';
import {UserRepository} from './user.repository';
import {AuthModule} from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      // signOptions: {
      //   algorithm: 'RS256'
      // }
    }),
    AuthModule,
    MailModule,
    CommonModule,
  ],
  providers: [
    TwoFactorAuthenticationService,
    UserService,
    UserRepository,
    SingleSignOnService,
    S3Handler,
  ],
  controllers: [UserController],
})
export class UserModule {}