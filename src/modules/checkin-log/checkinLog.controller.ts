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
import {ApiOperation, ApiResponse} from '@nestjs/swagger';

import {JwtAuthGuard} from '../auth/jwt-auth.guard';
import {CheckinLogService} from './checkinLog.service';
import {PushACheckinLogRequest} from './request/pushACheckinLog';

@Controller('checkin-log')
export class CheckinLogController {
  constructor(private readonly checkinLogService: CheckinLogService) {}

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
  // @UseGuards(JwtAuthGuard)
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
