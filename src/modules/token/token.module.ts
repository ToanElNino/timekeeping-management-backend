import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CurrencyConfig, Token, TokenMultichain} from '../../database/entities';
import {TokenController} from './token.controller';
import {TokenService} from './token.service';
import {AuthModule} from '../auth/auth.module';
import {AdminModule} from '../admin/admin.module';
import {PassportModule} from '@nestjs/passport';
import {JwtModule} from '@nestjs/jwt';
import {TokenModuleRepository} from './token.repository';
import {S3Handler} from 'src/shared/S3Handler';
import {Chain} from '../../database/entities';
@Module({
  imports: [
    TypeOrmModule.forFeature([Token, TokenMultichain, Chain]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      // signOptions: {
      //   algorithm: 'RS256'
      // }
    }),
    AuthModule,
    AdminModule,
  ],
  providers: [TokenService, TokenModuleRepository, S3Handler],
  controllers: [TokenController],
})
export class TokenModule {}
