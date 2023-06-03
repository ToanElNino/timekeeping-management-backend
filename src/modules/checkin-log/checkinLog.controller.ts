/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {ApiOperation, ApiQuery, ApiResponse} from '@nestjs/swagger';

import {JwtAuthGuard} from '../auth/jwt-auth.guard';
import {CheckinLogService} from './checkinLog.service';
import {PushACheckinLogRequest} from './request/pushACheckinLog';
import {RolesGuard} from '../auth/roles.guard';
import {Role} from 'src/shared/enums';
import {Roles} from '../auth/roles.decorator';
import {PaginationResponse} from 'src/config/rest/paginationResponse';
import {CheckinLog} from 'src/database/entities';

@Controller('checkin-log')
// @Roles(Role.ADMIN, Role.SUPER_ADMIN)
export class CheckinLogController {
  constructor(private readonly checkinLogService: CheckinLogService) {}

  @Get('user-get-checkin-log')
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ['checkin-log'],
    operationId: 'user get list checkin log',
    summary: 'user get list checkin log',
    description: 'user get list checkin log',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  @ApiQuery({
    name: 'day',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'tenantId',
    required: true,
    type: Number,
  })
  @ApiQuery({
    name: 'userId',
    required: true,
    type: Number,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
  })
  userGetListCheckinLog(
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('limit', new DefaultValuePipe(10)) limit: number,
    @Query('day') day: string,
    @Query('tenantId') tenantId: number,
    @Query('userId') userId: number
  ): Promise<any> {
    return this.checkinLogService.getListCheckinLog(
      {page, limit},
      {
        tenantId,
        userId,
        day,
      }
    );
  }

  @Post('/push-a-log')
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ['checkin-log'],
    operationId: 'push a checkin log',
    summary: 'push a checkin log',
    description: 'Admin push a checkin log',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  async pushALog(@Body() body: PushACheckinLogRequest): Promise<any> {
    return await this.checkinLogService.pushALog(body);
  }

  @Post('/push-list-logs')
  // @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({
    tags: ['checkin-log'],
    operationId: 'push list of checkin log',
    summary: 'push list of checkin logg',
    description: 'Admin push list of checkin log',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  async pushListLog(@Body() body: PushACheckinLogRequest[]): Promise<any> {
    return await this.checkinLogService.pushListLog(body);
  }
}
