import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {TimeSheet} from 'src/database/entities';
import {AuthModule} from '../auth/auth.module';
import {JwtModule} from '@nestjs/jwt';
import {TimeSheetController} from './TimeSheet.controller';
import {TimeSheetService} from './TimeSheet.service';
@Module({
  imports: [
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      // signOptions: { expiresIn: 24 * 60 * 60 },
    }),
    TypeOrmModule.forFeature([TimeSheet]),
  ],
  controllers: [TimeSheetController],
  providers: [TimeSheetService],
})
export class TimeSheetModule {}
