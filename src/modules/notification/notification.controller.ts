import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {NotificationService} from './notification.service';
import {ApiOperation, ApiResponse} from '@nestjs/swagger';
import {PushNotificationByTopic} from './request/pushNotiByTopic.dto';
import {PushNotificationFromEvent} from './request/pushNotiFromEvent.dto';
import {BaseResponse} from 'src/shared/response/baseResponse.dto';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';
import {PushNotificationByUserWallet} from './request/pushNotiByUserWallet.dto';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // @Get('total-not-read')
  // @UseGuards(JwtAuthGuard)
  // @ApiOperation({
  //   tags: ['notification'],
  //   operationId: 'getList',
  //   summary: 'Get all collection',
  //   description: 'Get all collection',
  // })
  // @UsePipes(new TrimPipe())
  // async getTotalNotReadNotification(
  //   @Req() request: any
  // ): Promise<Notification[]> {
  //   if (!request || !request.user || !request.user.id || !request.user.username)
  //     throw Causes.USER_NOT_ACCESS;
  //   return this.notificationService.getTotalNotReadNotification(request.user);
  // }

  // @Post('/update')
  // @UseGuards(JwtAuthGuard)
  // @ApiOperation({
  //   tags: ['notification'],
  //   operationId: 'update notification',
  //   summary: 'update notification',
  //   description: 'update a new notification',
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Successful',
  // })
  // async update(@Body() data: any, @Req() request: any) {
  //   const notification = await this.notificationService.update(
  //     data,
  //     request.user
  //   );

  //   return notification;
  // }

  // @Post('/firebase/push-notification-token')
  // @UseGuards(JwtAuthGuard)
  // @ApiOperation({
  //   tags: ['notification'],
  //   operationId: 'push notification for all',
  //   summary: 'push notification for all',
  //   description: 'push firebase notification for all',
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Successful',
  //   type: BaseResponse,
  // })
  // async pushNotificationToken(
  //   @Body() data: PushNotificationByToken,
  //   @Req() request: any
  // ) {
  //   const res = await this.notificationService.sendNotificationByToken(data);
  //   return res;
  // }

  @Post('/firebase/push-notification-user-wallet')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ['notification'],
    operationId: 'push notification by user wallet',
    summary: 'push notification by user wallet',
    description: 'push notification by user wallet',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: BaseResponse,
  })
  async pushNotificationByUserWallet(
    @Body() data: PushNotificationByUserWallet
  ) {
    await this.notificationService.sendNotificationByUserWallet(data);
    const res =
      await this.notificationService.createNotificationForIndividualClient(
        data.userWallet,
        data.title,
        data.body
      );
    return res;
  }

  // @Post('/firebase/push-notification-topic')
  // @UseGuards(JwtAuthGuard)
  // @ApiOperation({
  //   tags: ['notification'],
  //   operationId: 'push notification',
  //   summary: 'push notification',
  //   description: 'push firebase notification',
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Successful',
  //   type: BaseResponse,
  // })
  // async pushNotificationTopic(
  //   @Body() data: PushNotificationByTopic,
  //   @Req() request: any
  // ) {
  //   const res = await this.notificationService.sendNotificationTopic(data);
  //   return res;
  // }

  @Post('/firebase/push-notification-event')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ['notification'],
    operationId: 'push notification from event',
    summary: 'push notification from event',
    description: 'push firebase notification from event',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: BaseResponse,
  })
  async pushNotificationFromEvent(
    @Body() data: PushNotificationFromEvent,
    @Req() request: any
  ) {
    const eventItem = await this.notificationService.getValidEvent(
      data.eventId
    );
    const notificationData: PushNotificationByTopic = {
      topic: eventItem.topic,
      title: eventItem.title,
      body: eventItem.description,
    };
    await this.notificationService.sendNotificationTopic(notificationData);

    // eventItem.status = 'PUBLISHED';
    await this.notificationService.updateEventAfterPushing(eventItem);
    const res = await this.notificationService.createNotificationForAllClient(
      eventItem.title,
      eventItem.description
    );
    return res;
  }
}
