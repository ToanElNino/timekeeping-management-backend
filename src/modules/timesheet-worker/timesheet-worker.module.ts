import {Module} from '@nestjs/common';
import {ScheduleModule} from '@nestjs/schedule';
import {BullModule} from '@nestjs/bull';
import {TypeOrmModule} from '@nestjs/typeorm';
import {TimeSheetWorker} from './timesheet-worker.worker';
import {TimeSheetWorkerService} from './timesheet-worker.service';
import {CheckinLog, Schedule, TimeSheet} from 'src/database/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([TimeSheet, CheckinLog, Schedule]),
    ScheduleModule.forRoot(),
    BullModule.registerQueue({
      name: 'timesheet',
    }),
  ],
  providers: [TimeSheetWorker, TimeSheetWorkerService],
  controllers: [],
})
export class TimeSheetWorkerModule {}
