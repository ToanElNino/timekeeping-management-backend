/* eslint-disable @typescript-eslint/no-unused-vars */
import {Module} from '@nestjs/common';
import {MerchantController} from './merchant.controller';
import {MerchantService} from './merchant.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Merchant} from '../../database/entities';
import {AuthModule} from '../auth/auth.module';
import {JwtModule} from '@nestjs/jwt';
@Module({
  imports: [
    TypeOrmModule.forFeature([Merchant]),
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      // signOptions: { expiresIn: 24 * 60 * 60 },
    }),
  ],

  providers: [MerchantService],
  controllers: [MerchantController],
})
export class MerchantModule {}
