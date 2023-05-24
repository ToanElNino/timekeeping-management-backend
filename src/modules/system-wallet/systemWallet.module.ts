import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {
  CurrencyConfig,
  KmsCmk,
  KmsDataKey,
  SystemWallet,
} from '../../database/entities';
import {SystemWalletService} from './systemWallet.service';
import {SystemWalletController} from './systemWallet.controller';
import {KmsService} from '../common/kms.service';
import {AuthService} from '../auth/auth.service';
import {JwtModule, JwtService} from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';
import {AuthModule} from '../auth/auth.module';
import {SystemWalletRepository} from './system-wallet.repository';
@Module({
  imports: [
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      // signOptions: { expiresIn: 24 * 60 * 60 },
    }),
    TypeOrmModule.forFeature([
      SystemWallet,
      KmsDataKey,
      KmsCmk,
      CurrencyConfig,
    ]),
    PassportModule,
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      // signOptions: { expiresIn: 24 * 60 * 60 },
    }),
  ],
  providers: [
    SystemWalletService,
    KmsService,
    AuthService,
    JwtService,
    SystemWalletRepository,
  ],
  controllers: [SystemWalletController],
  exports: [SystemWalletService],
})
export class SystemWalletModule {}
