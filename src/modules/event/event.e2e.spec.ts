/* eslint-disable node/no-unpublished-import */
// ```yarn test -- src/modules/event/event.e2e.spec.ts --verbose``` to run test
import {INestApplication, HttpStatus} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import request from 'supertest';
import {getRepositoryToken} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Event} from 'src/database/entities';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';
import {EVENT_ITEM_MOCK, LIST_EVENT_MOCK} from './data-mock';
import {EventController} from './event.controller';
import {EventService} from './event.service';
import {CreateEventRequest} from './request/CreateEventReq.dto';
import {UpdateEventRequest} from './request/UpdateEventReq.dto';

describe('EventtController (e2e)', () => {
  let app: INestApplication;
  let eventItem: Event;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      // imports: [AuthModule],
      controllers: [EventController],
      providers: [
        EventService,
        {
          provide: getRepositoryToken(Event), // assuming you're using TypeORM
          useClass: Repository, // assuming this is the actual repository class
        },
        // AuthService,
      ],
    })
      .overrideProvider(EventService)
      .useValue({
        getListEvents: jest.fn().mockImplementation(() => {
          return LIST_EVENT_MOCK;
        }),
        createNewEvent: jest.fn().mockImplementation(() => {
          return EVENT_ITEM_MOCK;
        }),
        updateEvent: jest.fn().mockImplementation(() => {
          return {...EVENT_ITEM_MOCK, title: 'new title', topic: 'new topic'};
        }),
      })
      .overrideGuard(JwtAuthGuard)
      .useValue({CanActivate: jest.fn(() => true)})
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /events', () => {
    it('should create a new event', async () => {
      const params: CreateEventRequest = {
        title: 'New transaction!',
        description: 'You have been received new transaction',
        topic: 'GENERAL_TOPIC',
        address: '0x93902d47bE75950242D2557588cF45F0D3da2812',
        type: 'NOTIFICATION',
        datetimeStart: 1681355502,
        datetimeEnd: 1681355502,
      };
      const response = await request(app.getHttpServer())
        .post('/events')
        .send(params)
        .expect(HttpStatus.CREATED);
      const data = response.body;
      // expect()
      expect(data.title).toEqual(params.title);
      expect(data.description).toEqual(params.description);
      expect(data.topic).toEqual(params.topic);
      expect(data.type).toEqual(params.type);
      expect(data.datetimeStart).toEqual(params.datetimeStart);
      expect(data.datetimeEnd).toEqual(params.datetimeEnd);
      eventItem = data;
    });
  });

  describe('GET /events', () => {
    it('should return a list of event', async () => {
      const response = await request(app.getHttpServer())
        .get('/events')
        .query({limit: 10, offset: 0})
        .expect(HttpStatus.OK);

      const data = response.body;
      expect(data).toEqual([eventItem]);
      expect(data.length).toBeGreaterThan(0);
    });
  });

  describe('PUT /events', () => {
    it('should return updated event', async () => {
      const params: UpdateEventRequest = {
        ...eventItem,
        title: 'new title',
        topic: 'new topic',
      };
      const response = await request(app.getHttpServer())
        .put('/events')
        .send(params)
        .expect(HttpStatus.OK);
      // console.log('response: ', response.body);
      const data = response.body;
      // expect()
      expect(data.title).toEqual(params.title);
      expect(data.topic).toEqual(params.topic);
    });
  });
});
