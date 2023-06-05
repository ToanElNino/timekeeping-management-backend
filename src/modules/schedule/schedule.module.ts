import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AuthModule} from '../auth/auth.module';
import {JwtModule} from '@nestjs/jwt';
import {ScheduleController} from './schedule.controller';
import {ScheduleService} from './schedule.service';
import {Schedule} from 'src/database/entities';
@Module({
  imports: [
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      // signOptions: { expiresIn: 24 * 60 * 60 },
    }),
    TypeOrmModule.forFeature([Schedule]),
  ],
  controllers: [ScheduleController],
  providers: [ScheduleService],
})
export class ScheduleModule {}
