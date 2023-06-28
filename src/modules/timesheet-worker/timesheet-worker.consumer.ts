import {Job} from 'bull';
import {Process, Processor} from '@nestjs/bull';
import {Injectable} from '@nestjs/common';
import {TimeSheetWorkerService} from './timesheet-worker.service';

@Injectable()
@Processor('airdrop')
export class TimeSheetWorkerConsumer {
  constructor(
    private readonly timesheetWorkerService: TimeSheetWorkerService
  ) {}
  @Process({name: 'timesheet', concurrency: 1})
  async handleAirdropJob(job: Job) {
    console.log('job: ', job);
    await this.timesheetWorkerService.test();
  }
}
