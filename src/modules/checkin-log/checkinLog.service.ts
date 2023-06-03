import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {IPaginationOptions} from 'nestjs-typeorm-paginate';
import {PaginationResponse} from '../../config/rest/paginationResponse';
import {CheckinLog, Event} from '../../database/entities';
import {
  getArrayPaginationBuildTotal,
  getOffset,
  nowInMillis,
} from '../../shared/Utils';
import {Repository, getConnection} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Causes} from '../../config/exception/causes';
import {PushACheckinLogRequest} from './request/pushACheckinLog';

@Injectable()
export class CheckinLogService {
  constructor(
    @InjectRepository(CheckinLog)
    private checkinLogRepo: Repository<CheckinLog>
  ) {}

  async pushALog(data: PushACheckinLogRequest) {
    const logEntity: CheckinLog = {
      id: data.id,
      tenantId: data.tenantId,
      dayRecord: data.day_record,
      timeRecordNumber: data.time_record_number,
      createdAt: nowInMillis(),
      updatedAt: nowInMillis(),
      userId: data.user_id,
    };
    const log = await this.checkinLogRepo.save(logEntity);
    if (!log) {
      throw new HttpException(
        `Cannot push log id ${data.id} of user ${data.user_id} at day ${data.day_record}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
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
