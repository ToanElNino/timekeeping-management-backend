import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {IPaginationOptions} from 'nestjs-typeorm-paginate';
import {PaginationResponse} from '../../config/rest/paginationResponse';
import {CheckinLog, Event, Schedule, TimeSheet} from '../../database/entities';
import {
  getArrayPaginationBuildTotal,
  getOffset,
  nowInMillis,
} from '../../shared/Utils';
import {Repository, getConnection} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import { CreateScheduleRequest } from './request/createSchedule';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepo: Repository<Schedule>
  ) {}
  async getListCheckScheduleForTenant(
    paginationOptions: IPaginationOptions,
    params: any
  ) {
    const limit = Number(paginationOptions.limit);
    const offset = getOffset(paginationOptions);
    console.log(limit);
    console.log(offset);

    const queryBuilder = this.scheduleRepo
      .createQueryBuilder('schedule')
      .orderBy('schedule.created_at', 'DESC')
      .limit(limit)
      .offset(offset);
    const queryCount = this.scheduleRepo
      .createQueryBuilder('schedule')
      .select(' Count (1) as Total')
      .orderBy('schedule.created_at', 'DESC');
    //filter for topic and title by keyword params
    //tenant
    queryBuilder.andWhere('schedule.tenant_id =:tenantId', {
      tenantId: params.tenantId,
    });
    queryCount.andWhere('schedule.tenant_id =:tenantId', {
      tenantId: params.tenantId,
    });

    const data = await queryBuilder.getMany();
    const countData = await queryCount.execute();
    console.log(data);
    console.log(countData);
    const {items, meta} = getArrayPaginationBuildTotal<Schedule>(
      data,
      countData,
      {
        limit,
        offset,
      }
    );

    return {
      results: items,
      pagination: meta,
    };
  }

  async createSchedule(data: CreateScheduleRequest) {
    const schedule: Schedule = {
      createdAt: nowInMillis(),
      updatedAt: nowInMillis(),
      id: null,
      tenantId: data.tenantId,
      name: data.name,
      dayFrom: data.dayFrom,
      dayTo: data.dayTo,
      timeStart1: data.timeStart1,
      timeEnd1: data.timeEnd1,
      timeDelay1: data.timeDelay1,
      timeEarly1: data.timeEarl1,
      timeComeOff1: data.timeComeOff1,
      timeLeaveOff1: data.timeLeaveOff1,
      timeStart2: data.timeStart2,
      timeEnd2: data.timeEnd2,
      timeDelay2: data.timeDelay2,
      timeEarly2: data.timeEarl2,
      timeComeOff2: data.timeComeOff2,
      timeLeaveOff2: data.timeLeaveOff2,
      timeKeepingStrategyId: 0,
    };
    const newSchedule = await this.scheduleRepo.save(schedule);
    if (!newSchedule) {
      throw new HttpException(
        'Cannot create new schedule',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    return newSchedule;
  }
}
