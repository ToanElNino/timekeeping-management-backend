import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Event} from 'src/database/entities';
import {CreateEventRequest} from './request/CreateEventReq.dto';
import {nowInMillis} from 'src/shared/Utils';

export class EventRepository extends Repository<Event> {
  constructor(
    @InjectRepository(Event)
    repository: Repository<Event>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async filterEvent(offset: number, limit: number, params: any) {
    const queryBuilder = this.createQueryBuilder('event')
      .select([
        'event.id',
        'event.title',
        'event.description',
        'event.address',
        'event.datetimeStart',
        'event.datetimeEnd',
        'event.topic',
        'event.status',
        'event.type',
        'event.createdAt',
      ])
      .orderBy('event.createdAt', 'DESC')
      .limit(limit)
      .offset(offset);
    const queryCount = this.createQueryBuilder('event')
      .select(' Count (1) as Total')
      .orderBy('event.createdAt', 'DESC');
    //filter for topic and title by keyword params
    if (params.keyWord && params.keyWord !== '') {
      if (
        params.keyWord &&
        params.keyWord.includes('%') !== true &&
        params.keyWord.includes('_') !== true
      ) {
        queryBuilder.andWhere(
          `event.topic like '%${params.keyWord.trim()}%' || event.title like '%${params.keyWord.trim()}%'`
        );
        queryCount.andWhere(
          `event.topic like '%${params.keyWord.trim()}%' || event.title like '%${params.keyWord.trim()}%'`
        );
      } else {
        queryBuilder.andWhere(
          `event.title like '%!${params.keyWord.trim()}%' ESCAPE '!' || event.topic like '%!${params.keyWord.trim()}%' ESCAPE '!'`
        );
        queryCount.andWhere(
          `event.title like '%!${params.keyWord.trim()}%' ESCAPE '!' || event.topic like '%!${params.keyWord.trim()}%' ESCAPE '!'`
        );
      }
    }
    if (params.status) {
      queryBuilder.andWhere('event.status =:status', {
        status: params.status,
      });
      queryCount.andWhere('event.status =:status', {
        status: params.status,
      });
    }

    if (params.type) {
      queryBuilder.andWhere('event.type =:type', {
        type: params.type,
      });
      queryCount.andWhere('event.type =:type', {
        type: params.type,
      });
    }

    const data = await queryBuilder.getMany();
    const countData = await queryCount.execute();
    return {data, countData};
  }
  async createNew(body: CreateEventRequest) {
    const newItem: Partial<Event> = {
      title: body.title,
      description: body.description,
      topic: body.topic,
      address: body.address,
      datetimeStart: body.datetimeStart,
      datetimeEnd: body.datetimeEnd,
      type: body.type,
      status: 'NEW',
      createdAt: nowInMillis(),
      updatedAt: nowInMillis(),
    };
    return this.save(newItem);
  }
}
