// eslint-disable-next-line node/no-unpublished-import
import {Test} from '@nestjs/testing';
import {PaginationResponse} from 'src/config/rest/paginationResponse';
import {TypeOrmModule, getRepositoryToken} from '@nestjs/typeorm';
import {
  CurrencyConfig,
  Event,
  KmsCmk,
  KmsDataKey,
  SystemWallet,
} from '../../database/entities';
import {KmsService} from '../common/kms.service';
import {Repository} from 'typeorm';
import {Causes} from '../../config/exception/causes';
import {HttpException} from '@nestjs/common/exceptions';
import {HttpStatus} from '@nestjs/common';
import {EventService} from './event.service';
import {CreateEventRequest} from './request/CreateEventReq.dto';
import {UpdateEventActionRequest} from 'aws-sdk/clients/dataexchange';
import {UpdateEventRequest} from './request/UpdateEventReq.dto';
import {EventRepository} from './event.repository';
import {LIST_EVENT_MOCK} from './data-mock';
describe('EventService', () => {
  let service: EventService;
  let repository: EventRepository;
  ///
  beforeEach(async () => {
    // console.log(databaseConfig);
    const moduleRef = await Test.createTestingModule({
      imports: [
        // TypeORMMySqlTestingModule([SystemWallet]),
        // TypeOrmModule.forRoot(databaseConfig),
        // SystemWalletModule,
        // TypeOrmModule.forFeature([
        //   SystemWallet,
        //   KmsDataKey,
        //   KmsCmk,
        //   CurrencyConfig,
        // ]),
      ],
      providers: [
        EventRepository,
        {
          provide: getRepositoryToken(Event),
          useValue: {
            filterEvent: jest.fn(),
            // save: jest.fn(),
          },
          useClass: Repository,
        },
        EventService,
        {
          provide: getRepositoryToken(Event),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
          useClass: Repository,
        },
      ],
    }).compile();

    service = moduleRef.get<EventService>(EventService);
    repository = moduleRef.get<EventRepository>(EventRepository);
  });
  it('service should be defined', () => {
    expect(service).toBeDefined();
    // expect(service).toBeDefined();
  });

  it('event repository should be defined', () => {
    expect(repository).toBeDefined();
    // expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of event and pagination', async () => {
      const result: PaginationResponse<any> = {
        pagination: {
          currentPage: 1,
          itemCount: 1,
          itemsPerPage: 10,
          totalItems: 1,
          totalPages: 1,
        },
        results: LIST_EVENT_MOCK as Event[],
      };
      const test = [{Total: 1}];

      const mock_filter_value = {
        data: LIST_EVENT_MOCK as Event[],
        countData: test,
      };
      jest
        .spyOn(repository, 'filterEvent')
        .mockImplementation(async () => mock_filter_value);
      expect(
        await service.getListEvents(
          {status: '', name: ''},
          {page: 1, limit: 10}
        )
      ).toEqual(result);
    });
  });
  describe('create new event', () => {
    it('should return exception due to invalid type event', async () => {
      const req: CreateEventRequest = {
        title: 'New transaction!',
        description: 'You have been received new transaction',
        topic: 'GENERAL_TOPIC',
        address: '0x93902d47bE75950242D2557588cF45F0D3da2812',
        type: 'NOTIFICATION-abc',
        datetimeStart: 1681355502,
        datetimeEnd: 1681355502,
      };

      try {
        await service.createNewEvent(req);
      } catch (error) {
        expect(error).toEqual(Causes.CANNOT_CREATE_EVENT_DUE_TO_INVALID_TYPE);
      }
    });
    it('should return http exception when call repository.save ', async () => {
      const req: CreateEventRequest = {
        title: 'New transaction!',
        description: 'You have been received new transaction',
        topic: 'GENERAL_TOPIC',
        address: '0x93902d47bE75950242D2557588cF45F0D3da2812',
        type: 'NOTIFICATION',
        datetimeStart: 1681355502,
        datetimeEnd: 1681355502,
      };

      jest.spyOn(repository, 'save').mockResolvedValueOnce(undefined);
      try {
        await service.createNewEvent(req);
      } catch (error) {
        expect(error).toEqual(Causes.EVENT_SAVE_REPOSITORY_FAILED);
      }
    });
  });

  describe('Update event', () => {
    it('should return exception due to invalid type event', async () => {
      const req: UpdateEventRequest = {
        id: 1,
        title: 'New transaction!',
        description: 'You have been received new transaction',
        topic: 'GENERAL_TOPIC',
        address: '0x93902d47bE75950242D2557588cF45F0D3da2812',
        type: 'NOTIFICATION-abc',
        datetimeStart: 1681355502,
        datetimeEnd: 1681355502,
      };

      try {
        await service.updateEvent(req);
      } catch (error) {
        expect(error).toEqual(Causes.CANNOT_CREATE_EVENT_DUE_TO_INVALID_TYPE);
      }
    });
    it('should return http exception when event does not exist ', async () => {
      const req: UpdateEventRequest = {
        id: 1,
        title: 'New transaction!',
        description: 'You have been received new transaction',
        topic: 'GENERAL_TOPIC',
        address: '0x93902d47bE75950242D2557588cF45F0D3da2812',
        type: 'NOTIFICATION',
        datetimeStart: 1681355502,
        datetimeEnd: 1681355502,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(undefined);
      try {
        await service.updateEvent(req);
      } catch (error) {
        expect(error).toEqual(Causes.EVENT_DOES_NOT_EXISTED);
      }
    });

    it('should return http exception when call repository.save ', async () => {
      const req: UpdateEventRequest = {
        id: 1,
        title: 'New transaction!',
        description: 'You have been received new transaction',
        topic: 'GENERAL_TOPIC',
        address: '0x93902d47bE75950242D2557588cF45F0D3da2812',
        type: 'NOTIFICATION',
        datetimeStart: 1681355502,
        datetimeEnd: 1681355502,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce({
        id: 1,
        title: 'New transaction!',
        description: 'You have been received new transaction',
        topic: 'GENERAL_TOPIC',
        address: '0x93902d47bE75950242D2557588cF45F0D3da2812',
        type: 'NOTIFICATION',
        datetimeStart: 1681355502,
        datetimeEnd: 1681355502,
      } as Event);
      jest.spyOn(repository, 'save').mockResolvedValueOnce(undefined);

      try {
        await service.updateEvent(req);
      } catch (error) {
        expect(error).toEqual(Causes.EVENT_SAVE_REPOSITORY_FAILED);
      }
    });
  });
});
