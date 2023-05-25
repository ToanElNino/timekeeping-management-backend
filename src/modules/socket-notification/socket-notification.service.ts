import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {SocketNotification, User} from '../../database/entities';
import {getConnection, Repository} from 'typeorm';
import {IPaginationOptions} from 'nestjs-typeorm-paginate';
import {getArrayPaginationBuildTotal, getOffset} from '../../shared/Utils';

@Injectable()
export class SocketNotificationService {
  constructor(
    @InjectRepository(SocketNotification)
    private readonly socketNotificationRepository: Repository<SocketNotification>
  ) {}

  // async getListNotification(
  //   params,
  //   paginationOptions: IPaginationOptions,
  //   user: User
  // ) {
  //   const offset = getOffset(paginationOptions);
  //   const limit = Number(paginationOptions.limit);

  //   const queryBuilder = getConnection()
  //     .createQueryBuilder('socket_notification', 'socket_notification')
  //     .leftJoin(User, 'user', 'user.id = socket_notification.recipient_id')
  //     .select(
  //       `
  //               socket_notification.id,
  //               socket_notification.recipient_id as recipientId,
  //               socket_notification.content,
  //               socket_notification.type,
  //               socket_notification.is_read as isRead,
  //               socket_notification.sent_at as sentAt,
  //               user.username as username,
  //               user.email as userEmail,
  //               user.avatar_url as userAvatarUrl,
  //               user.wallet as userWallet,
  //               socket_notification.created_at as createdAt,
  //               socket_notification.updated_at as updatedAt
  //           `
  //     )
  //     .where('socket_notification.recipient_id = :recipientId', {
  //       recipientId: user.id,
  //     })
  //     .offset(offset)
  //     .limit(limit)
  //     .orderBy('socket_notification.updated_at', 'DESC');

  //   const queryCount = getConnection()
  //     .createQueryBuilder('socket_notification', 'socket_notification')
  //     .leftJoin(User, 'user', 'user.id = socket_notification.recipient_id')
  //     .select('COUNT(*) as Total')
  //     .where('socket_notification.recipient_id = :recipientId', {
  //       recipientId: user.id,
  //     });

  //   if (params.type) {
  //     queryBuilder.andWhere('socket_notification.type = :type', {
  //       type: params.type,
  //     });
  //     queryCount.andWhere('socket_notification.type = :type', {
  //       type: params.type,
  //     });
  //   }

  //   if (params.isRead) {
  //     queryBuilder.andWhere('socket_notification.is_read = :isRead', {
  //       isRead: params.isRead,
  //     });
  //     queryCount.andWhere('socket_notification.is_read = :isRead', {
  //       isRead: params.isRead,
  //     });
  //   }

  //   if (params.search) {
  //     queryBuilder.andWhere('socket_notification.content LIKE :search', {
  //       search: `%${params.search}%`,
  //     });
  //     queryCount.andWhere('socket_notification.content LIKE :search', {
  //       search: `%${params.search}%`,
  //     });
  //   }

  //   const socketNotifications = await queryBuilder.execute();
  //   const total = await queryCount.execute();

  //   const {items, meta} = getArrayPaginationBuildTotal<any>(
  //     socketNotifications,
  //     total,
  //     paginationOptions
  //   );

  //   return {items, meta};
  // }

  getSocketsNotificationById(id: number) {
    const socketNotification = getConnection()
      .createQueryBuilder('socket_notification', 'socket_notification')
      .leftJoin(User, 'user', 'user.id = socket_notification.recipient_id')
      .select(
        `
                socket_notification.id,
                socket_notification.recipient_id as recipientId,
                socket_notification.content,
                socket_notification.type,
                socket_notification.is_read as isRead,
                socket_notification.sent_at as sentAt,
                user.username as username, 
                user.email as userEmail, 
                user.avatar_url as userAvatarUrl,
                user.wallet as userWallet,
                socket_notification.created_at as createdAt,
                socket_notification.updated_at as updatedAt
            `
      )
      .where('socket_notification.id = :id', {id: id})
      .getRawOne();

    return socketNotification;
  }

  // create socket notification
  async createSocketNotification(data) {
    const socketNotification = new SocketNotification();
    socketNotification.recipientId = data.recipientId;
    socketNotification.content = data.content;
    socketNotification.type = data.type;
    socketNotification.isRead = data.isRead;
    socketNotification.sentAt = data.sentAt;

    return await this.socketNotificationRepository.save(socketNotification);
  }
}
