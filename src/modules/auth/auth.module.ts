import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {PassportModule} from '@nestjs/passport';
import {JwtModule} from '@nestjs/jwt';
import {JwtStrategy} from './jwt.strategy';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Account, Admin, Tenant, User} from '../../database/entities';
import {MailService} from '../mail/mail.service';
import {SingleSignOnService} from '../user/sso.service';
import {TwoFactorAuthenticationService} from '../user/twoFactorAuthentication.service';
import {S3Handler} from '../../shared/S3Handler';
import {AuthRepository} from './auth.repository';
@Module({
  imports: [
    TypeOrmModule.forFeature([Admin, Account, User, Tenant]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      // signOptions: { expiresIn: 24 * 60 * 60 },
    }),
  ],
  providers: [AuthService, MailService, JwtStrategy, AuthRepository],
  controllers: [AuthController],
  exports: [AuthService, JwtStrategy, AuthRepository],
})
export class AuthModule {}
