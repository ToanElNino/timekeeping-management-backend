import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {IPaginationOptions} from 'nestjs-typeorm-paginate';
import {CheckinLog, Request, TimeSheet} from '../../database/entities';
import {
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
import { AcceptRequestBody } from './request/acceptRequest';

export const REQUEST_TYPE = {
  CI_CO: 3,
  WORK_FROM_HOME: 1,
  DAY_OFF: 2,
};
export const REQUEST_STATUS = {
  PENDING: 'PENDING',
};
@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(Request)
    private requestRepo: Repository<Request>,
    @InjectRepository(CheckinLog)
    private checkinLogRepo: Repository<CheckinLog>,
    @InjectRepository(TimeSheet)
    private timeSheetRepo: Repository<TimeSheet>
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
    const newRequest: Partial<Request> = {
      tenantId,
      userId,
      type: REQUEST_TYPE.DAY_OFF,
      leaveType: data.TypeLeave,
      reason: data.reason,
      workingDayPart: data.WorkingDayPart,
      // CICODay: '',
      dayFrom: data.dayFrom,
      dayTo: data.dayTo,
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
      workingDayPart: data.WorkingDayPart,
      dayFrom: data.dayFrom,
      dayTo: data.dayTo,
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

  async adminAcceptCICORequest(body: AcceptRequestBody){
     
  }
}
