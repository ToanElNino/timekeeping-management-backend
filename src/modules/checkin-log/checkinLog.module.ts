import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CheckinLog} from 'src/database/entities';
import {AuthModule} from '../auth/auth.module';
import {JwtModule} from '@nestjs/jwt';
import {CheckinLogController} from './checkinLog.controller';
import {CheckinLogService} from './checkinLog.service';
@Module({
  imports: [
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      // signOptions: { expiresIn: 24 * 60 * 60 },
    }),
    TypeOrmModule.forFeature([CheckinLog]),
  ],
  controllers: [CheckinLogController],
  providers: [CheckinLogService],
})
export class CheckinLogModule {}
