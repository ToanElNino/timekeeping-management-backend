import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {IPaginationOptions} from 'nestjs-typeorm-paginate';
import {PaginationResponse} from '../../config/rest/paginationResponse';
import {CheckinLog, Event, TimeSheet} from '../../database/entities';
import {
  getArrayPaginationBuildTotal,
  getOffset,
  nowInMillis,
} from '../../shared/Utils';
import {Repository, getConnection} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';

@Injectable()
export class TimeSheetService {
  constructor(
    @InjectRepository(TimeSheet)
    private timeSheetRepo: Repository<TimeSheet>,
    @InjectRepository(CheckinLog)
    private checkinLogRepo: Repository<CheckinLog>
  ) {}
  async getListCheckinLog(paginationOptions: IPaginationOptions, params: any) {
    const limit = Number(paginationOptions.limit);
    const offset = getOffset(paginationOptions);
    console.log(limit);
    console.log(offset);

    const queryBuilder = this.timeSheetRepo
      .createQueryBuilder('time_sheet')
      .orderBy('time_sheet.createdAt', 'DESC')
      .limit(limit)
      .offset(offset);
    const queryCount = this.timeSheetRepo
      .createQueryBuilder('time_sheet')
      .select(' Count (1) as Total')
      .orderBy('time_sheet.createdAt', 'DESC');
    //filter for topic and title by keyword params
    //tenant
    queryBuilder.andWhere('time_sheet.tenant_id =:tenantId', {
      tenantId: params.tenantId,
    });
    queryCount.andWhere('time_sheet.tenant_id =:tenantId', {
      tenantId: params.tenantId,
    });
    //month
    queryBuilder.andWhere('time_sheet.month_record =:month', {
      month: params.month,
    });
    queryCount.andWhere('time_sheet.month_record =:month', {
      month: params.month,
    });
    //user id
    if (params.userId) {
      queryBuilder.andWhere('time_sheet.user_id =:userId', {
        userId: params.userId,
      });
      queryCount.andWhere('time_sheet.user_id =:userId', {
        userId: params.userId,
      });
    }
    //day
    if (params.day) {
      queryBuilder.andWhere('time_sheet.day_record =:day', {
        day: params.day,
      });
      queryCount.andWhere('time_sheet.day_record =:day', {
        day: params.day,
      });
    }

    const data = await queryBuilder.getMany();
    const countData = await queryCount.execute();
    console.log(data);
    console.log(countData);
    const {items, meta} = getArrayPaginationBuildTotal<TimeSheet>(
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

  async calculateATimeSheet(item: TimeSheet) {
    if (item.isCalculated) {
      return item;
    }
    const checkinLog = await this.checkinLogRepo.find({where: {id: item.id}});
    if (!checkinLog) return {...item};
  }
}
