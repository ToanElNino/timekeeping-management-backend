import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {ApiOperation, ApiQuery, ApiResponse} from '@nestjs/swagger';
import RequestWithUser from '../user/requestWithUser.interface';
import {SocketNotificationService} from './socket-notification.service';
import {Causes} from '../../config/exception/causes';

@Controller('socket-notification')
export class SocketNotificationController {
  constructor(
    private readonly socketNotificationService: SocketNotificationService
  ) {}

  // @Get('/list')
  // @ApiOperation({
  //   tags: ['socket-notification'],
  //   operationId: 'getNotifications',
  //   summary: 'Get all notifications',
  //   description: 'Get all notifications',
  // })
  // @UseGuards(JwtAuthGuard)
  // @ApiQuery({
  //   name: 'page',
  //   required: true,
  // })
  // @ApiQuery({
  //   name: 'limit',
  //   required: true,
  // })
  // @ApiQuery({
  //   name: 'type',
  //   required: false,
  // })
  // @ApiQuery({
  //   name: 'search',
  //   required: false,
  // })
  // @ApiQuery({
  //   name: 'isRead',
  //   required: false,
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Successful',
  // })
  // async getAllNotification(
  //   @Req() request: RequestWithUser,
  //   @Query('page') page: number,
  //   @Query('limit') limit: number,
  //   @Query('type') type: string,
  //   @Query('search') search: string,
  //   @Query('isRead') isRead: string
  // ) {
  //   const user = request.user;

  //   const socketNotifications =
  //     await this.socketNotificationService.getListNotification(
  //       {type, isRead, search},
  //       {page, limit},
  //       user
  //     );

  //   return socketNotifications;
  // }

  //api get notification by id
  @Get('/detail/:id')
  @ApiOperation({
    tags: ['socket-notification'],
    operationId: 'getNotificationById',
    summary: 'Get notification by id',
    description: 'Get notification by id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  async getNotificationById(
    @Param('id') id: number,
    @Req() request: RequestWithUser
  ) {
    const socketNotification =
      await this.socketNotificationService.getSocketsNotificationById(id);

    if (!socketNotification) {
      throw Causes.DATA_INVALID;
    }
    return socketNotification;
  }
}
