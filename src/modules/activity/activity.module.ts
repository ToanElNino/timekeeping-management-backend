import {Module} from '@nestjs/common';
import {ActivityController} from './activity.controller';
import {ActivityService} from './activity.service';
import {Transaction} from '../../database/entities';
import {TypeOrmModule} from '@nestjs/typeorm';
import {JwtModule} from '@nestjs/jwt';
import {TransactionRepository} from './activity.repository';
@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  providers: [ActivityService, TransactionRepository],
  controllers: [ActivityController],
})
export class ActivityModule {}
