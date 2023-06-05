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
import {CreateACLRequest} from 'aws-sdk/clients/memorydb';
import {CreateRequest} from './request/createRequest';

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

  async createRequest(data: CreateRequest) {
    switch (data.type) {
      case 1:
        return this.createCICORequest(data);
      default:
        throw new HttpException('Invalid type request', HttpStatus.BAD_REQUEST);
    }
  }

  async createCICORequest(data: CreateRequest) {
    // const monthRecord = data.dayRecord.substring(data.dayRecord.length - 7);
    // const logEntity: CheckinLog = {
    //   id: data.id,
    //   tenantId: data.tenantId,
    //   dayRecord: data.dayRecord,
    //   monthRecord,
    //   timeRecordNumber: data.timeRecordNumber,
    //   createdAt: nowInMillis(),
    //   updatedAt: nowInMillis(),
    //   userId: data.userId,
    // };
    // const log = await this.checkinLogRepo.save(logEntity);
    // if (!log) {
    //   throw new HttpException(
    //     `Cannot push log id ${data.id} of user ${data.userId} at day ${data.dayRecord}`,
    //     HttpStatus.INTERNAL_SERVER_ERROR
    //   );
    // }
    // const timeSheetDB = await this.timeSheetRepo.findOne({
    //   where: {id: data.id},
    // });
    // console.log(timeSheetDB);
    // if (!timeSheetDB) {
    //   const timeSheetEntity: Partial<TimeSheet> = {
    //     id: data.id,
    //     tenantId: data.tenantId,
    //     dayRecord: data.dayRecord,
    //     monthRecord,
    //     timeRecordNumber: data.timeRecordNumber,
    //     createdAt: nowInMillis(),
    //     updatedAt: nowInMillis(),
    //     userId: data.userId,
    //   };
    //   await this.timeSheetRepo.save(timeSheetEntity);
    // }

    // return log;
    return {};
  }
}
