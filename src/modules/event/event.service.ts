import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {IPaginationOptions} from 'nestjs-typeorm-paginate';
import {PaginationResponse} from '../../config/rest/paginationResponse';
import {Event} from '../../database/entities';
import {
  getArrayPaginationBuildTotal,
  getOffset,
  nowInMillis,
} from '../../shared/Utils';
import {Repository, getConnection} from 'typeorm';
import {CreateEventRequest} from './request/CreateEventReq.dto';
import {InjectRepository} from '@nestjs/typeorm';
import {UpdateEventRequest} from './request/UpdateEventReq.dto';
import {Causes} from '../../config/exception/causes';

import {EventRepository} from './event.repository';
@Injectable()
export class EventService {
  constructor(private eventRepository: EventRepository) {}
  async getListEvents(
    params,
    paginationOptions: IPaginationOptions
  ): Promise<PaginationResponse<Event>> {
    const offset = getOffset(paginationOptions);
    const limit = Number(paginationOptions.limit);

    const {data, countData} = await this.eventRepository.filterEvent(
      offset,
      limit,
      params
    );
    const {items, meta} = getArrayPaginationBuildTotal<Event>(
      data,
      countData,
      paginationOptions
    );

    return {
      results: items,
      pagination: meta,
    };
  }

  async createNewEvent(body: CreateEventRequest) {
    // const newPrivatedKey = await argon2.hash(body.systemWallet);
    // const record = await this.kmsCmkRepository.findOne({
    //   id,
    // });
    if (
      body.type !== 'EVENT' &&
      body.type !== 'WARNING' &&
      body.type !== 'NOTIFICATION'
    ) {
      throw Causes.CANNOT_CREATE_EVENT_DUE_TO_INVALID_TYPE;
    }

    const insertItem = await this.eventRepository.createNew(body);
    if (insertItem) {
      // delete insertItem.privateKey;
      return insertItem;
    }
    throw Causes.EVENT_SAVE_REPOSITORY_FAILED;
  }

  async updateEvent(body: UpdateEventRequest) {
    if (
      body.type !== 'EVENT' &&
      body.type !== 'WARNING' &&
      body.type !== 'NOTIFICATION'
    ) {
      throw Causes.CANNOT_CREATE_EVENT_DUE_TO_INVALID_TYPE;
    }
    const eventDB = await this.eventRepository.findOne({
      where: {id: body.id},
    });
    if (!eventDB) {
      throw Causes.EVENT_DOES_NOT_EXISTED;
    }
    //update
    eventDB.title = body.title;
    eventDB.description = body.description;
    eventDB.topic = body.topic;
    eventDB.address = body.address;
    eventDB.datetimeStart = body.datetimeStart;
    eventDB.datetimeEnd = body.datetimeEnd;
    eventDB.type = body.type;
    const updateEvent = await this.eventRepository.save(eventDB);
    if (updateEvent) {
      return updateEvent;
    }
    throw Causes.EVENT_SAVE_REPOSITORY_FAILED;
  }
}
