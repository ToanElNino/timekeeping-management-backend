import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CheckinLog, Request, TimeSheet} from 'src/database/entities';
import {AuthModule} from '../auth/auth.module';
import {JwtModule} from '@nestjs/jwt';
import {RequestController} from './request.controller';
import {RequestService} from './request.service';
@Module({
  imports: [
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      // signOptions: { expiresIn: 24 * 60 * 60 },
    }),
    TypeOrmModule.forFeature([CheckinLog, TimeSheet, Request]),
  ],
  controllers: [RequestController],
  providers: [RequestService],
})
export class RequestModule {}
