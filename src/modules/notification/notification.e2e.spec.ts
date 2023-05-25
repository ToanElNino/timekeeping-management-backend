/* eslint-disable node/no-unpublished-import */
// ```yarn test -- src/modules/user-device/userDevice.e2e.spec.ts --verbose``` to run test
import {
  INestApplication,
  HttpStatus,
  CACHE_MANAGER,
  HttpException,
} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import request from 'supertest';
import {Event, UserDevice} from 'src/database/entities';
import {NotificationService} from './notification.service';
import {NotificationController} from './notification.controller';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';
import {PushNotificationByUserWallet} from './request/pushNotiByUserWallet.dto';
import {PushNotificationFromEvent} from './request/pushNotiFromEvent.dto';
import {Causes} from 'src/config/exception/causes';
import {PushNotificationByTopic} from './request/pushNotiByTopic.dto';

describe('NotificationController (e2e)', () => {
  let app: INestApplication;
  let service: NotificationService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      // imports: [AuthModule],
      controllers: [NotificationController],
      providers: [
        NotificationService,
        // AuthService,
      ],
    })
      .overrideProvider(NotificationService)
      .useValue({
        createNotificationForIndividualClient: jest.fn(),
        getValidEvent: jest.fn(),
        sendNotificationTopic: jest.fn(),
        sendNotificationByUserWallet: jest.fn(),
        updateEventAfterPushing: jest.fn(),
        createNotificationForAllClient: jest.fn(),
      })
      .overrideGuard(JwtAuthGuard)
      .useValue({CanActivate: jest.fn(() => true)})
      .compile();
    service = moduleFixture.get<NotificationService>(NotificationService);
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /firebase/push-notification-user-wallet', () => {
    it('should push notification for client by user wallet success ', async () => {
      const params: PushNotificationByUserWallet = {
        userWallet: '0x1ABC7154748D1CE5144478CDEB574AE244B939B5',
        title: 'ABC',
        body: 'New notification',
      };

      jest
        .spyOn(service, 'sendNotificationByUserWallet')
        .mockImplementation(async () => {
          return params;
        });
      jest
        .spyOn(service, 'createNotificationForIndividualClient')
        .mockImplementation(async () => {
          return {message: params.body, title: params.title};
        });
      await request(app.getHttpServer())
        .post('/notification/firebase/push-notification-user-wallet')
        .query(params)
        .expect(HttpStatus.CREATED);
    });
  });

  describe('POST /firebase/push-notification-event', () => {
    it('should push notification from event fail ', async () => {
      const params: PushNotificationFromEvent = {
        eventId: 1,
      };

      jest.spyOn(service, 'getValidEvent').mockImplementation(async () => {
        throw Causes.EVENT_DOES_NOT_EXISTED;
      });
      await request(app.getHttpServer())
        .post('/notification/firebase/push-notification-event')
        .query(params)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should push notification success ', async () => {
      const params: PushNotificationFromEvent = {
        eventId: 1,
      };
      const eventMockItem = {
        id: 1,
        title: 'ABC',
        description: 'New notification',
        topic: 'GENERAL_TOPIC',
      } as Event;

      jest.spyOn(service, 'getValidEvent').mockImplementation(async () => {
        return eventMockItem;
      });
      jest
        .spyOn(service, 'sendNotificationTopic')
        .mockImplementation(async () => {
          return {
            body: eventMockItem.description,
            title: eventMockItem.title,
            topic: eventMockItem.topic,
          } as PushNotificationByTopic;
        });
      await request(app.getHttpServer())
        .post('/notification/firebase/push-notification-event')
        .query(params)
        .expect(HttpStatus.CREATED);
    });
  });
});
