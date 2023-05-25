import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {getLogger} from '../../shared/logger';
import {getConnection, Repository} from 'typeorm';
import {Event, Notification, User, UserDevice} from '../../database/entities';
import {InjectRepository} from '@nestjs/typeorm';
import {IPaginationOptions} from 'nestjs-typeorm-paginate';
import {MailService} from '../mail/mail.service';
import {TelegramService} from './telegram.service';
import * as admin from 'firebase-admin';
import {PushNotificationByTopic} from './request/pushNotiByTopic.dto';
import {PushNotificationByToken} from './request/pushNotiByToken.dto';
import {nowInMillis} from 'src/shared/Utils';
import {Causes} from 'src/config/exception/causes';
import {EventStatus} from 'src/shared/enums';
import {PushNotificationByUserWallet} from './request/pushNotiByUserWallet.dto';

const NOTIFICATION_INTERVAL = 1000 * 60 * 60; // 5 minutes
const lastSendTime = {};
const logger = getLogger('NotificationService');
@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
    @InjectRepository(UserDevice)
    private userDeviceRepo: Repository<UserDevice>,
    private mailService: MailService,
    private telegramService: TelegramService,
    @InjectRepository(Event)
    private eventRepo: Repository<Event>
  ) {
  }

  async notificationException(exception: string) {
    const message = this.convertMessage(exception);
    if (message === '') {
      return;
    }
    const now = new Date();
    if (now.getTime() - lastSendTime[message] < NOTIFICATION_INTERVAL) {
      logger.info('Error: ' + message);
      return;
    }

    lastSendTime[message] = now.getTime();
    this.mailService.sendNotification(message);
    this.telegramService.sendNotification(message);
    logger.info('Sent notification: ' + message);
  }

  async notificationLowBalance(
    network: string,
    address: string,
    balance: string,
    token: string
  ) {
    const message = `${network.toLocaleUpperCase()} has low balance (${balance} ${token}). Please add more ${token} to ${address}.`;
    await this.notificationException(message);
  }

  convertMessage(message: string) {
    if (message.indexOf('execution reverted: Invalid amount') >= 0) {
      return (
        message.split(' ')[0].toLocaleUpperCase() +
        ' does not have enough ZennyToken in funding pool to proceed a pending transaction. Please add more ZennyToken to funding pool.'
      );
    }
    if (message.indexOf('execution reverted: Only admin') >= 0) {
      return (
        message.split(' ')[0].toLocaleUpperCase() +
        ' You have NOT set the admin permission for master wallet address.'
      );
    }
    if (message.indexOf('Could not construct tx because of lacking fee') >= 0) {
      return (
        message.split(' ')[0].toLocaleUpperCase() +
        ' Could not construct tx because of lacking fee. Please add more native coin to master wallet address.'
      );
    }
    if (message.indexOf('has low balance') >= 0) {
      return message;
    }
    return '';
  }

  // async getTotalNotReadNotification(owner: User) {
  //   const user = await this.userRepo.findOne(owner.id);
  //   const queryBuilder = getConnection()
  //     .createQueryBuilder(Notification, 'notification')
  //     .select('Count (1) as Total')
  //     .where(
  //       '(notification.to_user = :toUser and notification.is_read = :isRead and notification.type in (7,8,9,10,11)) or notification.type = 0',
  //       {toUser: user.wallet, isRead: false}
  //     );

  //   const data = await queryBuilder.execute();
  //   return data;
  // }

  async update(data: any, user: User) {
    let notification = await this.notificationRepo.findOne(data.id);
    notification.isRead = true;
    notification = await this.notificationRepo.save(notification);

    return notification;
  }

  getOffset(paginationOptions: IPaginationOptions) {
    let offset = 0;
    if (paginationOptions.page && paginationOptions.limit) {
      if (Number(paginationOptions.page) > 0) {
        offset =
          (Number(paginationOptions.page) - 1) *
          Number(paginationOptions.limit);
      }
    }
    return offset;
  }

  async sendNotificationTopic(data: PushNotificationByTopic) {
    // 
    return data;
  }

  async sendNotificationByToken(data: PushNotificationByToken) {
   return data;
  }

  async sendNotificationByUserWallet(data: PushNotificationByUserWallet) {
    return data;
  }

  async getValidEvent(eventId: number) {
    const item: Event = await this.eventRepo.findOne({
      where: {
        id: eventId,
      },
    });
    if (!item) {
      throw Causes.EVENT_DOES_NOT_EXISTED;
    }
    if (item.status === 'PUBLISHED') {
      throw Causes.EVENT_ALREADY_PUSHED;
    }
    return item;
  }

  async updateEventAfterPushing(eventItem: Event) {
    eventItem.status = EventStatus.PUBLISHED;
    const updateItem = await this.eventRepo.save(eventItem);
    if (updateItem) {
      return updateItem;
    }
    throw Causes.EVENT_SAVE_REPOSITORY_FAILED;
  }

  async createNotificationForAllClient(title: string, message: string) {
    const newNotification: Partial<Notification> = {
      id: null,
      userWallet: null,
      title: title,
      message: message,
      isRead: false,
      isGlobal: true,
      createdAt: nowInMillis(),
      updatedAt: nowInMillis(),
    };
    const res = await this.notificationRepo.save(newNotification);
    if (!res) {
      throw Causes.NOTIFICATION_SAVE_REPOSITORY_FAILED;
    }
    return {title, message};
  }

  async createNotificationForIndividualClient(
    userWallet: string,
    title: string,
    message: string
  ) {
    const newNotification: Partial<Notification> = {
      id: null,
      userWallet: userWallet,
      title: title,
      message: message,
      isRead: false,
      isGlobal: false,
      createdAt: nowInMillis(),
      updatedAt: nowInMillis(),
    };
    const res = await this.notificationRepo.save(newNotification);
    if (!res) {
      throw Causes.NOTIFICATION_SAVE_REPOSITORY_FAILED;
    }
    return {title, message};
  }
}
