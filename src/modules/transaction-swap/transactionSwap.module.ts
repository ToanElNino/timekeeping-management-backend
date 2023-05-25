import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Token, Transaction, TransactionSwap} from '../../database/entities';
import {TransactionSwapService} from './transactionSwap.service';
import {TransactionSwapController} from './transactionSwap.controller';
import {AuthModule} from '../auth/auth.module';
import {JwtModule} from '@nestjs/jwt';
import {TransactionSwapRepository} from './transactionSwap.repository';

@Module({
  imports: [
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      // signOptions: { expiresIn: 24 * 60 * 60 },
    }),
    TypeOrmModule.forFeature([TransactionSwap, Transaction, Token]),
  ],
  providers: [TransactionSwapService, TransactionSwapRepository],
  controllers: [TransactionSwapController],
  exports: [TransactionSwapService],
})
export class TransactionSwapModule {}
