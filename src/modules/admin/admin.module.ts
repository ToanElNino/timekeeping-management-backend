import {Module} from '@nestjs/common';
import {AdminService} from './admin.service';
import {AdminController} from './admin.controller';
import {PassportModule} from '@nestjs/passport';
import {JwtModule} from '@nestjs/jwt';
import {JwtStrategy} from '../auth/jwt.strategy';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Admin, User} from '../../database/entities';
import {MailService} from '../mail/mail.service';
import {SingleSignOnService} from '../user/sso.service';
import {TwoFactorAuthenticationService} from '../user/twoFactorAuthentication.service';
import {UserService} from '../user/user.service';
import {S3Handler} from '../../shared/S3Handler';
import {AuthModule} from '../auth/auth.module';
import {AdminRepository} from './admin.repository';
@Module({
  imports: [
    TypeOrmModule.forFeature([Admin, User]),
    PassportModule,
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      // signOptions: { expiresIn: 24 * 60 * 60 },
    }),
  ],
  providers: [AdminService, MailService, JwtStrategy, AdminRepository],
  controllers: [AdminController],
  exports: [AdminService, MailService, JwtStrategy, AdminRepository],
})
export class AdminModule {}
