import {Injectable} from '@nestjs/common';
import {Cron} from '@nestjs/schedule';
import {TimeSheetWorkerService} from './timesheet-worker.service';

@Injectable()
export class TimeSheetWorker {
  constructor(private timesheetWorkerService: TimeSheetWorkerService) {}
  @Cron('*/10 * * * * *')
  async handleCron() {
    console.log('handleCron: ', new Date());
    await this.timesheetWorkerService.calculateTimeSheetForTenant(1);
  }

  // @Cron('*/5 * * * * *')
  // async test() {
  //   this.timesheetWorkerService.getCurrentDayString();
  //   // await this.airdropService.getNewJob();
  // }
}
