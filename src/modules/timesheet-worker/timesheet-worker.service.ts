import {Injectable} from '@nestjs/common';
import {Queue} from 'bull';
import {InjectQueue} from '@nestjs/bull';
import {InjectRepository} from '@nestjs/typeorm';
import {CheckinLog, Schedule, TimeSheet} from 'src/database/entities';
import {Repository} from 'typeorm';
import {nowInMillis} from 'src/shared/Utils';
import {now} from 'lodash';
import {time} from 'console';

@Injectable()
export class TimeSheetWorkerService {
  constructor(
    @InjectQueue('timesheet') private timesheetQueue: Queue,
    @InjectRepository(Schedule)
    private scheduleRepo: Repository<Schedule>,
    @InjectRepository(CheckinLog)
    private checkinRepo: Repository<CheckinLog>,
    @InjectRepository(TimeSheet)
    private timesheetRepo: Repository<TimeSheet>
  ) {}
  async test() {
    console.log('test worker time sheet');
  }
  // tính timesheet cho 1 tenant
  async calculateTimeSheetForTenant(tenantId: number) {
    // get schedule của tenant
    const scheduleTenant = await this.getCurrentTenantSchedule(tenantId);
    if (!scheduleTenant) return;
    // lấy ngày hôm nay DD-MM-YYYY
    const today = this.getCurrentDayString();
    // Lấy danh sách timesheet trong ngày
    const timesheetList = await this.getTenantSameDayTimeSheet(tenantId, today);
    // console.log('today: ', today);
    console.log('timesheetList: ', timesheetList);
    // vòng lặp để xử lý từng time sheet của tenant trong ngày hôm đó
    for (const timesheet of timesheetList) {
      await this.calculateTimeSheetForUser(timesheet, scheduleTenant);
    }
  }
  async calculateTimeSheetForUser(timeSheet: TimeSheet, schedule: Schedule) {
    const ids = timeSheet.id.split('_');
    const tenantId = Number(ids[0]);
    const userId = Number(ids[1]);
    const day = ids[2];
    const checkinLogListUser = await this.getCheckinLogForUser(
      tenantId,
      userId,
      day
    );
    // console.log('checkinLogListUser: ', checkinLogListUser);
    //không có data checkin
    if (!checkinLogListUser.length) return;
    //chỉ có 1 log=> chỉ up date time come
    if (checkinLogListUser.length === 1) {
      await this.timesheetRepo.save({
        ...timeSheet,
        timeCome: Number(checkinLogListUser[0].timeRecordNumber),
      });
      return;
    }
    //có ít nhất 2 log trở lên
    const listCheckinTime = [];
    checkinLogListUser.forEach((e: CheckinLog) =>
      listCheckinTime.push(Number(e.timeRecordNumber))
    );
    //lấy thời gian chấm công đầu tiên và cuối cùng cho tới hiện tại
    const {checkinTime, checkoutTime} =
      this.getCheckinAndCheckoutTimeFromListTime(listCheckinTime);
    //stop == true thì không cần tính time sheet cho buổi chiều nữa
    const {morningTimesheet, stop} = await this.calculateTimeSheetMorning(
      checkinTime,
      checkoutTime,
      timeSheet,
      schedule
    );
    // else if (checkinLogListUser.length === 1) {
    //   console.log('1');
    // } else {
    //   console.log('2');
    //   const listCheckinTime = [];
    //   checkinLogListUser.forEach((e: CheckinLog) =>
    //     listCheckinTime.push(Number(e.timeRecordNumber))
    //   );
    //   const {checkinTime, checkoutTime} =
    //     this.getCheckinAndCheckoutTimeFromListTime(listCheckinTime);

    //   // const tmp = `${day.substring(6, 10)}-${day.substring(
    //   //   3,
    //   //   5
    //   // )}-${day.substring(0, 2)}`;
    //   // //không cần cập nhật
    //   // if (
    //   //   timeSheet.timeCome === checkinTime &&
    //   //   timeSheet.timeLeave === checkoutTime
    //   // ) {
    //   //   return;
    //   // }
    //   // await this.handleTimeSheetFromCheckinOutTime(
    //   //   timeSheet,
    //   //   checkinTime,
    //   //   checkoutTime,
    //   //   schedule,
    //   //   tmp
    //   // );
    //   // console.log(listCheckinTime);
    // }
  }
  millisSecondToMinutes = (millis: number) => {
    return millis / (1000 * 60);
  };
  // async handleTimeSheetFromCheckinOutTime(
  //   timeSheet: TimeSheet,
  //   checkinTime: number,
  //   checkoutTime: number,
  //   schedule: Schedule,
  //   today: string
  // ) {
  //   console.log(today);
  //   const currentTime = new Date().getTime();
  //   console.log(currentTime);
  //   const timeStart1 = new Date(today + ' ' + schedule.timeStart1).getTime();
  //   const timeEnd1 = new Date(today + ' ' + schedule.timeEnd1).getTime();
  //   const timeComeOff1 = new Date(
  //     today + ' ' + schedule.timeComeOff1
  //   ).getTime();
  //   const timeStart2 = new Date(today + ' ' + schedule.timeStart1).getTime();
  //   const timeEnd2 = new Date(today + ' ' + schedule.timeEnd1).getTime();
  //   // const timeDelay;

  //   //tính checkin time và checkout time trước
  //   // đang trong thời gian làm việc => chỉ cập nhật checkin time
  //   if (currentTime < timeEnd2) {
  //     if (timeSheet.timeCome !== checkinTime)
  //       await this.timesheetRepo.save({
  //         ...this.timesheetQueue,
  //         timeCome: checkinTime,
  //       });
  //     return;
  //   }
  //   //hết thời gian làm việc => cập nhật cả 2
  //   if (currentTime > timeEnd2) {
  //     console.log('123');
  //     console.log(typeof timeSheet.timeCome);
  //     console.log(typeof checkinTime);
  //     if (Number(timeSheet.timeCome) !== checkinTime) {
  //       console.log('114');
  //       timeSheet.timeCome = checkinTime;
  //       //update thời gian vào
  //       //có làm việc buổi sáng
  //       if (checkinTime <= timeEnd1) {
  //         console.log('115');
  //         //đúng giờ
  //         if (checkinTime <= timeStart1) {
  //           console.log('116');
  //           timeSheet.comeLateMinutes = 0;
  //           timeSheet.workingDay1 = 0.5;
  //         }
  //         //muộn giờ vẫn có lương
  //         if (checkinTime > timeStart1 && checkinTime < timeComeOff1) {
  //           console.log('117');
  //           timeSheet.workingDay1 = 0.25;
  //           timeSheet.comeLateMinutes = this.millisSecondToMinutes(
  //             checkinTime - timeStart1
  //           );
  //         }
  //         //không được tính lương
  //         if (checkinTime > timeComeOff1 && checkinTime < timeEnd1) {
  //           timeSheet.comeLateMinutes = this.millisSecondToMinutes(
  //             checkinTime - timeStart1
  //           );
  //           timeSheet.workingDay1 = 0;
  //         }
  //       }
  //       await this.timesheetRepo.save(timeSheet);
  //     }
  //     if (timeSheet.timeCome !== checkinTime) {
  //       timeSheet.timeCome = checkinTime;
  //     }
  //   }
  // }

  getCheckinAndCheckoutTimeFromListTime(listTime: number[]) {
    let min = listTime[0];
    let max = listTime[0];
    listTime.forEach((e: number) => {
      if (e < min) min = e;
      if (e > max) max = e;
    });
    console.log('checkin time: ', min);
    console.log('checkout time: ', max);

    return {checkinTime: min, checkoutTime: max};
  }

  //tính công cho buổi sáng
  async calculateTimeSheetMorning(
    checkinTime: number,
    checkoutTime: number,
    timesheet: TimeSheet,
    schedule: Schedule
  ) {
    const timeStampNow = new Date().getTime();
    const timeStampEnd = this.convertScheduleStringToTimeStamp(
      schedule.timeEnd1
    );
    // đang trong giờ làm buổi sáng, chắc chắn là checkin time vào buổi sáng => chỉ lưu thời gian checkin, chưa tính toán
    if (timeStampNow < timeStampEnd) {
      // update thời gian checkin
      if (checkinTime !== timesheet.timeCome)
        timesheet.timeCome = Number(checkinTime);
      await this.timesheetRepo.save({
        ...timesheet,
      });
      return {morningTimesheet: timesheet, stop: true};
    }
    //qua thời gian làm buổi sáng => tính time sheet cho buổi sáng
    ////////check thời gian checkin
    let maxWorkingDay = 0.5;
    const timeStampStart = this.convertScheduleStringToTimeStamp(
      schedule.timeStart1
    );
    const timeStampDelay = this.convertScheduleStringToTimeStamp(
      schedule.timeDelay1
    );

    const timeStampComeOff = this.convertScheduleStringToTimeStamp(
      schedule.timeComeOff1
    );
    // eslint-disable-next-line no-empty
    if (checkinTime <= timeStampDelay) {
      console.log('come in time');
    }
    //đến muộn, bị trừ nửa công buổi sáng
    else if (checkinTime > timeStampDelay && checkinTime <= timeStampComeOff) {
      maxWorkingDay -= 0.25;
    }
    //đến muộn, không được tính công buổi sáng
    else if (checkinTime > timeStampComeOff) {
      maxWorkingDay -= 0.5;
    }
    /////////check thời gian check out
    const timeStampLeaveOff = this.convertScheduleStringToTimeStamp(
      schedule.timeLeaveOff1
    );
    const timeStampEarly = this.convertScheduleStringToTimeStamp(
      schedule.timeEarly1
    );

    // const timeStampComeOff = this.convertScheduleStringToTimeStamp(
    //   schedule.timeComeOff1
    // );
    // eslint-disable-next-line no-empty
    //về sớm không được tính lương buổi sáng
    if (checkoutTime <= timeStampLeaveOff) {
      maxWorkingDay = -0.5;
    }
    //về sớm bị trừ nửa lương sáng
    if (checkoutTime > timeStampLeaveOff && checkoutTime < timeStampEarly) {
      maxWorkingDay = -0.25;
    }
    //đến muộn, không được tính công buổi sáng
    else if (checkinTime > timeStampComeOff) {
      maxWorkingDay -= 0.5;
    }

    //tính công buổi sáng
    maxWorkingDay = maxWorkingDay ?? 0;
    timesheet.workingDay1 = maxWorkingDay;
    timesheet.timeCome = checkinTime;
    await this.timesheetRepo.save({
      ...timesheet,
    });
    return {morningTimesheet: timesheet, stop: false};
  }

  async getCheckinLogForUser(tenantId: number, userId: number, day: string) {
    const checkinLogListUser = await this.checkinRepo.find({
      where: {
        tenantId: tenantId,
        dayRecord: day,
        userId: userId,
      },
    });
    if (!checkinLogListUser) return [];
    return checkinLogListUser;
  }
  async getCurrentTenantSchedule(tenantId: number) {
    const schedule = await this.scheduleRepo.findOne({
      where: {
        tenantId: tenantId,
        status: 'ACTIVE',
      },
    });
    // console.log(schedule);
    return schedule;
  }
  getCurrentDayString() {
    const today = new Date();
    return today.toLocaleString('es-CL').substring(0, 10);
  }
  async getTenantSameDayTimeSheet(tenantId: number, day: string) {
    const timesheetList = await this.timesheetRepo.find({
      where: {
        tenantId: tenantId,
        dayRecord: day,
      },
    });
    return timesheetList;
  }
  // chuyển string schedule thành time stamp cùng ngày
  convertScheduleStringToTimeStamp(hourString: string) {
    const hour = Number(hourString.substring(0, 2));
    const minute = Number(hourString.substring(3, 5));
    console.log(`hour: ${hour} - minute: ${minute}`);
    const date = new Date();
    const res = date.setHours(hour, minute, 0, 0);
    console.log('res: ', res);
    return res;
  }
}
