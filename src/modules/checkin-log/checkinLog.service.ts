import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {IPaginationOptions} from 'nestjs-typeorm-paginate';
import {CheckinLog, TimeSheet} from '../../database/entities';
import {
  getArrayPaginationBuildTotal,
  getOffset,
  nowInMillis,
} from '../../shared/Utils';
import {Repository, getConnection} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {PushACheckinLogRequest} from './request/pushACheckinLog';

@Injectable()
export class CheckinLogService {
  constructor(
    @InjectRepository(CheckinLog)
    private checkinLogRepo: Repository<CheckinLog>,
    @InjectRepository(TimeSheet)
    private timeSheetRepo: Repository<TimeSheet>
  ) {}
  async getListCheckinLog(paginationOptions: IPaginationOptions, params: any) {
    const limit = Number(paginationOptions.limit);
    const offset = getOffset(paginationOptions);
    console.log(limit);
    console.log(offset);

    const queryBuilder = this.checkinLogRepo
      .createQueryBuilder('checkin_log')
      .orderBy('checkin_log.createdAt', 'DESC')
      .limit(limit)
      .offset(offset);
    const queryCount = this.checkinLogRepo
      .createQueryBuilder('checkin_log')
      .select(' Count (1) as Total')
      .orderBy('checkin_log.createdAt', 'DESC');
    //filter for topic and title by keyword params

    queryBuilder.andWhere('checkin_log.tenant_id =:tenantId', {
      tenantId: params.tenantId,
    });
    queryCount.andWhere('checkin_log.tenant_id =:tenantId', {
      tenantId: params.tenantId,
    });
    //month
    queryBuilder.andWhere('checkin_log.month_record =:month', {
      month: params.month,
    });
    queryCount.andWhere('checkin_log.month_record =:month', {
      month: params.month,
    });
    //user id
    queryBuilder.andWhere('checkin_log.user_id =:userId', {
      userId: params.userId,
    });
    queryCount.andWhere('checkin_log.user_id =:userId', {
      userId: params.userId,
    });
    //day
    if (params.day) {
      queryBuilder.andWhere('checkin_log.day_record =:day', {
        day: params.day,
      });
      queryCount.andWhere('checkin_log.day_record =:day', {
        day: params.day,
      });
    }

    const data = await queryBuilder.getMany();
    const countData = await queryCount.execute();
    console.log(data);
    console.log(countData);
    const {items, meta} = getArrayPaginationBuildTotal<CheckinLog>(
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
  async pushALog(data: PushACheckinLogRequest) {
    const monthRecord = data.dayRecord.substring(data.dayRecord.length - 7);
    const logEntity: CheckinLog = {
      id: data.id,
      tenantId: data.tenantId,
      dayRecord: data.dayRecord,
      monthRecord,
      timeRecordNumber: data.timeRecordNumber,
      createdAt: nowInMillis(),
      updatedAt: nowInMillis(),
      userId: data.userId,
    };
    const log = await this.checkinLogRepo.save(logEntity);
    if (!log) {
      throw new HttpException(
        `Cannot push log id ${data.id} of user ${data.userId} at day ${data.dayRecord}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    const timeSheetDB = await this.timeSheetRepo.findOne({
      where: {id: data.id},
    });
    console.log(timeSheetDB);
    if (!timeSheetDB) {
      const timeSheetEntity: Partial<TimeSheet> = {
        id: data.id,
        tenantId: data.tenantId,
        dayRecord: data.dayRecord,
        monthRecord,
        timeRecordNumber: data.timeRecordNumber,
        createdAt: nowInMillis(),
        updatedAt: nowInMillis(),
        userId: data.userId,
      };
      await this.timeSheetRepo.save(timeSheetEntity);
    }

    return log;
  }

  async pushListLog(data: PushACheckinLogRequest[]) {
    const res: CheckinLog[] = [];
    for (const key in data) {
      res.push(await this.pushALog(data[key]));
    }
    return res;
  }
}
