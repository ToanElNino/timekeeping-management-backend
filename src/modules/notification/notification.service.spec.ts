// eslint-disable-next-line node/no-unpublished-import
import {Test} from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
import {Event, Notification, User, UserDevice} from '../../database/entities';
import {Repository} from 'typeorm';
import {Causes} from '../../config/exception/causes';
import {NotificationService} from './notification.service';
import {MailService} from '../mail/mail.service';
import {MailerService} from '@nestjs-modules/mailer';
jest.mock('firebase-admin');
import {TelegramService} from './telegram.service';
describe('EventService', () => {
  let service: NotificationService;
  let notiRepository: Repository<Notification>;
  let eventRepo: Repository<Event>;
  ///
  beforeEach(async () => {
    // console.log(databaseConfig);
    const module = await Test.createTestingModule({
      imports: [],
      providers: [
        Repository<Notification>,
        {
          provide: getRepositoryToken(Notification),
          useValue: {},
          useClass: Repository,
        },
        Repository<Event>,
        {
          provide: getRepositoryToken(Event),
          useValue: {
            // findOne: jest.fn(),
          },
          useClass: Repository,
        },
        Repository<UserDevice>,
        {
          provide: getRepositoryToken(UserDevice),
          useValue: {
            // findOne: jest.fn(),
          },
          useClass: Repository,
        },
        Repository<User>,
        {
          provide: getRepositoryToken(User),
          useValue: {},
          useClass: Repository,
        },
        NotificationService,
        MailService,
        {
          provide: MailerService,
          useValue: {},
        },
        TelegramService,
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    notiRepository = module.get<Repository<Notification>>(
      getRepositoryToken(Notification)
    );
    eventRepo = module.get<Repository<Event>>(getRepositoryToken(Event));
  });
  it('service should be defined', () => {
    expect(service).toBeDefined();
    // expect(service).toBeDefined();
  });
  it('event repository should be defined', () => {
    expect(eventRepo).toBeDefined();
    // expect(service).toBeDefined();
  });

  it('notification repository should be defined', () => {
    expect(notiRepository).toBeDefined();
    // expect(service).toBeDefined();
  });

  describe('getValidEvent', () => {
    it('should return valid event item, ready to be pushed', async () => {
      jest.spyOn(eventRepo, 'findOne').mockResolvedValueOnce({
        id: 99,
        status: 'NEW',
      } as Event);
      try {
        await service.getValidEvent(99);
      } catch (error) {
        expect(error).toEqual(Causes.EVENT_ALREADY_PUSHED);
      }
    });
    it('should return exception because event not found in db ', async () => {
      jest.spyOn(eventRepo, 'findOne').mockResolvedValueOnce(undefined);
      try {
        await service.getValidEvent(99);
      } catch (error) {
        expect(error).toEqual(Causes.EVENT_DOES_NOT_EXISTED);
      }
    });
    it('should return exception because event already pushed (status is PUBLISHED)', async () => {
      jest.spyOn(eventRepo, 'findOne').mockResolvedValueOnce({
        id: 99,
        status: 'PUBLISHED',
      } as Event);
      try {
        await service.getValidEvent(99);
      } catch (error) {
        expect(error).toEqual(Causes.EVENT_ALREADY_PUSHED);
      }
    });
  });
});
