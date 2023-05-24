import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Chain} from '../../database/entities';
import {JwtModule} from '@nestjs/jwt';
import {AuthModule} from '../auth/auth.module';
import {ChainService} from '../chain/chain.service';
import {ChainRepository} from '../chain/chain.repository';
import {ChainController} from '../chain/chain.controller';
import {S3Handler} from 'src/shared/S3Handler';
@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Chain]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  providers: [ChainService, ChainRepository, S3Handler],
  controllers: [ChainController],
})
export class ChainModule {}
