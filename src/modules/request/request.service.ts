import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {IPaginationOptions} from 'nestjs-typeorm-paginate';
import {
  CheckinLog,
  Request,
  Schedule,
  TimeSheet,
  User,
} from '../../database/entities';
import {v4 as uuidv4} from 'uuid';

import {
  convertMillisToDateString,
  convertScheduleStringToTimeStampForADay,
  getArrayPaginationBuildTotal,
  getOffset,
  nowInMillis,
} from '../../shared/Utils';
import {Repository, getConnection} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {
  CreateCICORequest,
  CreateDayOffRequest,
  CreateWorkFromHomeRequest,
} from './request/createRequest';
import {AcceptRequestBody} from './request/acceptRequest';
import {RejectRequestBody} from './request/rejectRequest';

export const REQUEST_TYPE = {
  CI_CO: 3,
  WORK_FROM_HOME: 1,
  DAY_OFF: 2,
};
export const REQUEST_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};

export const REQUEST_WORKING_PART = {
  MORNING: 'MORNING',
  AFTERNOON: 'AFTERNOON',
  ALLDAY: 'ALLDAY',
};

export const REQUEST_LEAVE_TYPE = {
  PAID_LEAVE: 'PAID_LEAVE',
  UNPAID_LEAVE: 'UNPAID_LEAVE',
};

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(Request)
    private requestRepo: Repository<Request>,
    @InjectRepository(CheckinLog)
    private checkinLogRepo: Repository<CheckinLog>,
    @InjectRepository(TimeSheet)
    private timeSheetRepo: Repository<TimeSheet>,
    @InjectRepository(Schedule)
    private scheduleRepo: Repository<Schedule>,
    @InjectRepository(User)
    private userRepo: Repository<User>
  ) {}

  async createCICORequest(
    data: CreateCICORequest,
    tenantId: number,
    userId: number
  ) {
    const newRequest: Partial<Request> = {
      tenantId,
      userId,
      type: REQUEST_TYPE.CI_CO,
      reason: data.reason,
      changeCITime: data.Time,
      changeCIType: data.Type,
      createdAt: nowInMillis(),
      updatedAt: nowInMillis(),
      status: REQUEST_STATUS.PENDING,
    };
    const request = await this.requestRepo.save(newRequest);
    if (!request)
      throw new HttpException(
        'Cannot create request',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    return request;
  }

  async createDayOffRequest(
    data: CreateDayOffRequest,
    tenantId: number,
    userId: number
  ) {
    console.log(data.workingDayPart);
    const newRequest: Partial<Request> = {
      tenantId,
      userId,
      type: REQUEST_TYPE.DAY_OFF,
      leaveType: data.typeLeave,
      reason: data.reason,
      workingDayPart: data.workingDayPart,
      // CICODay: '',
      dayTimeStamp: data.dayTimeStamp,
      createdAt: nowInMillis(),
      updatedAt: nowInMillis(),
      status: REQUEST_STATUS.PENDING,
    };
    const request = await this.requestRepo.save(newRequest);
    if (!request)
      throw new HttpException(
        'Cannot create request',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    return request;
  }

  async createWorkFromHomeRequest(
    data: CreateWorkFromHomeRequest,
    tenantId: number,
    userId: number
  ) {
    const newRequest: Partial<Request> = {
      tenantId,
      userId,
      type: REQUEST_TYPE.WORK_FROM_HOME,
      reason: data.reason,
      workingDayPart: data.workingDayPart,
      dayTimeStamp: data.dayTimeStamp,
      createdAt: nowInMillis(),
      updatedAt: nowInMillis(),
      status: REQUEST_STATUS.PENDING,
    };
    const request = await this.requestRepo.save(newRequest);
    if (!request)
      throw new HttpException(
        'Cannot create request',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    return request;
  }

  //accept
  async adminAcceptCICORequest(
    body: AcceptRequestBody,
    adminTenantId: number,
    adminUserId: number
  ) {
    const request = await this.requestRepo.findOne({
      where: {
        id: body.requestId,
        type: REQUEST_TYPE.CI_CO,
        status: REQUEST_STATUS.PENDING,
      },
    });
    if (!request)
      throw new HttpException('Request not found', HttpStatus.BAD_REQUEST);
    if (request.tenantId !== adminTenantId)
      throw new HttpException('Forbidden tenant', HttpStatus.FORBIDDEN);
    //create checkin log
    const dayRecord = await convertMillisToDateString(
      request.changeCITime,
      'DAY'
    );
    const monthRecord = await convertMillisToDateString(
      request.changeCITime,
      'MONTH'
    );
    // console.log(dayRecord);
    // console.log(monthRecord);

    const newCheckinLog: CheckinLog = {
      id: uuidv4(),
      tenantId: request.tenantId,
      userId: request.userId,
      dayRecord,
      monthRecord,
      timeRecordNumber: request.changeCITime,
      createdAt: nowInMillis(),
      updatedAt: nowInMillis(),
    };

    const res = await this.checkinLogRepo.save(newCheckinLog);
    if (!res) {
      throw new HttpException(
        'Cannot update checkin log',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    //update request
    request.resolveByUserId = adminUserId;
    request.status = REQUEST_STATUS.APPROVED;
    request.updatedAt = nowInMillis();
    await this.requestRepo.save(request);
    return request;
  }

  async adminAcceptDayOffRequest(
    body: AcceptRequestBody,
    adminTenantId: number,
    adminUserId: number
  ) {
    const request = await this.requestRepo.findOne({
      where: {
        tenantId: adminTenantId,
        id: body.requestId,
        type: REQUEST_TYPE.DAY_OFF,
        status: REQUEST_STATUS.PENDING,
      },
    });
    if (!request)
      throw new HttpException('Request not found', HttpStatus.BAD_REQUEST);
    if (request.tenantId !== adminTenantId)
      throw new HttpException('Forbidden tenant', HttpStatus.FORBIDDEN);

    //get schedule
    const tenantSchedule = await this.scheduleRepo.findOne({
      where: {
        tenantId: request.tenantId,
      },
    });

    if (!tenantSchedule) {
      throw new HttpException(
        'Can not find tenant schedule',
        HttpStatus.BAD_REQUEST
      );
    }
    // get timesheet, nếu chưa có thì tạo

    //check working part request

    const dayRecord = await convertMillisToDateString(
      request.dayTimeStamp,
      'DAY'
    );
    const monthRecord = await convertMillisToDateString(
      request.dayTimeStamp,
      'MONTH'
    );
    let timeSheetDB = await this.timeSheetRepo.findOne({
      where: {id: `${adminTenantId}_${request.userId}_${dayRecord}`},
    });
    if (!timeSheetDB) {
      const timeSheetEntity: Partial<TimeSheet> = {
        id: `${request.tenantId}_${request.userId}_${dayRecord}`,
        tenantId: request.tenantId,
        dayRecord,
        monthRecord,
        createdAt: nowInMillis(),
        updatedAt: nowInMillis(),
        userId: request.userId,
        timeRecordNumber: 0,
      };
      timeSheetDB = await this.timeSheetRepo.save(timeSheetEntity);
    }
    console.log('timesheet: ', timeSheetDB);
    if (!timeSheetDB)
      throw new HttpException(
        'Cannot get or create timesheet',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    // nghỉ không lương, đánh dấu là nghỉ có xin phép 0
    if (request.leaveType === REQUEST_LEAVE_TYPE.UNPAID_LEAVE) {
      if (request.workingDayPart === REQUEST_WORKING_PART.MORNING) {
        timeSheetDB.workingDay1Off = 0;
      } else if (request.workingDayPart === REQUEST_WORKING_PART.AFTERNOON) {
        timeSheetDB.workingDay2Off = 0;
      } else if (request.workingDayPart === REQUEST_WORKING_PART.ALLDAY) {
        timeSheetDB.workingDay1Off = 0;
        timeSheetDB.workingDay2Off = 0;
      }
    }
    // nghỉ không lương, đánh dấu là nghỉ có xin phép 0.5 công 1 buổi
    if (request.leaveType === REQUEST_LEAVE_TYPE.PAID_LEAVE) {
      if (request.workingDayPart === REQUEST_WORKING_PART.MORNING) {
        timeSheetDB.workingDay1Off = 0.5;
      } else if (request.workingDayPart === REQUEST_WORKING_PART.AFTERNOON) {
        timeSheetDB.workingDay2Off = 0.5;
      } else if (request.workingDayPart === REQUEST_WORKING_PART.ALLDAY) {
        timeSheetDB.workingDay1Off = 0.5;
        timeSheetDB.workingDay2Off = 0.5;
      }
    }
    await this.timeSheetRepo.save(timeSheetDB);

    //create checkin log
    // const dayRecord = await convertMillisToDateString(
    //   request.changeCITime,
    //   'DAY'
    // );
    // const monthRecord = await convertMillisToDateString(
    //   request.changeCITime,
    //   'MONTH'
    // );
    // // console.log(dayRecord);
    // // console.log(monthRecord);

    // const newCheckinLog: CheckinLog = {
    //   id: uuidv4(),
    //   tenantId: request.tenantId,
    //   userId: request.userId,
    //   dayRecord,
    //   monthRecord,
    //   timeRecordNumber: request.changeCITime,
    //   createdAt: nowInMillis(),
    //   updatedAt: nowInMillis(),
    // };

    // const res = await this.checkinLogRepo.save(newCheckinLog);
    // if (!res) {
    //   throw new HttpException(
    //     'Cannot update checkin log',
    //     HttpStatus.INTERNAL_SERVER_ERROR
    //   );
    // }
    //update request
    request.resolveByUserId = adminUserId;
    request.status = REQUEST_STATUS.APPROVED;
    request.updatedAt = nowInMillis();
    await this.requestRepo.save(request);
    return request;
  }

  //reject
  async adminRejectRequest(
    body: RejectRequestBody,
    adminTenantId: number,
    adminUserId: number
  ) {
    const request = await this.requestRepo.findOne({
      where: {
        id: body.requestId,
        type: REQUEST_TYPE.CI_CO,
        status: REQUEST_STATUS.PENDING,
      },
    });
    if (!request)
      throw new HttpException(
        'Request not found or can not reject now',
        HttpStatus.BAD_REQUEST
      );
    if (request.tenantId !== adminTenantId)
      throw new HttpException('Forbidden tenant', HttpStatus.FORBIDDEN);
    //update request
    request.resolveByUserId = adminUserId;
    request.status = REQUEST_STATUS.REJECTED;
    request.rejectReason = body.reason;
    request.updatedAt = nowInMillis();
    await this.requestRepo.save(request);
    return request;
  }
}
