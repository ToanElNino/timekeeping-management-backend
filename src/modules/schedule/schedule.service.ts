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
import {CreateScheduleRequest} from './request/createSchedule';
import {UpdateScheduleRequest} from './request/updateSchedule';

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
      status: 'ACTIVE',
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
      latestTime: data.latestTime,
      earliestTime: data.earliestTime,
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
  async getATenantSchedule(tenantId: number) {
    const schedule = await this.scheduleRepo.findOne({
      where: {
        tenantId: tenantId,
      },
    });
    if (!schedule) return new Schedule();
    return schedule;
  }
  async updateSchedule(data: UpdateScheduleRequest) {
    const scheduleDB = await this.scheduleRepo.findOne({
      where: {id: data.id},
    });
    if (!scheduleDB) {
      throw new HttpException('Invalid schedule id', HttpStatus.BAD_REQUEST);
    }

    // scheduleDB.dayFrom = data.dayFrom;
    // scheduleDB.dayTo = data.dayTo;
    scheduleDB.timeStart1 = data.timeStart1;
    scheduleDB.timeEnd1 = data.timeEnd1;
    scheduleDB.timeDelay1 = data.timeDelay1;
    scheduleDB.timeEarly1 = data.timeEarl1;
    scheduleDB.timeComeOff1 = data.timeComeOff1;
    scheduleDB.timeLeaveOff1 = data.timeLeaveOff1;
    scheduleDB.timeStart2 = data.timeStart2;
    scheduleDB.timeEnd2 = data.timeEnd2;
    scheduleDB.timeDelay2 = data.timeDelay2;
    scheduleDB.timeEarly2 = data.timeEarl2;
    scheduleDB.timeComeOff2 = data.timeComeOff2;
    scheduleDB.timeLeaveOff2 = data.timeLeaveOff2;
    scheduleDB.latestTime = data.latestTime;
    scheduleDB.earliestTime = data.earliestTime;
    scheduleDB.timeKeepingStrategyId = 0;
    const updateSchedule = await this.scheduleRepo.save(scheduleDB);
    if (!updateSchedule) {
      throw new HttpException(
        'Cannot update new schedule',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    return updateSchedule;
  }
}
