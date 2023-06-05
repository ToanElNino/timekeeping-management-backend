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
import {ScheduleService} from './schedule.service';
import { CreateScheduleRequest } from './request/createSchedule';

@Controller('schedule')
// @Roles(Role.ADMIN, Role.SUPER_ADMIN)
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get('get-list-schedule-tenant')
  @ApiOperation({
    tags: ['schedule'],
    operationId: 'tenant get list schedule',
    summary: 'tenant get list schedule',
    description: 'tenant get list schedule',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  @ApiQuery({
    name: 'tenantId',
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
  userGetListTimeSheet(
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('limit', new DefaultValuePipe(10)) limit: number,

    @Query('tenantId') tenantId: number
  ): Promise<any> {
    return this.scheduleService.getListCheckScheduleForTenant(
      {page, limit},
      {
        tenantId,
      }
    );
  }

  @Post('/create-schedule')
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ['schedule'],
    operationId: 'admin create a schedule for tenant',
    summary: 'admin create a schedule for tenant',
    description: 'admin create a schedule for tenant',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  async pushALog(@Body() body: CreateScheduleRequest): Promise<any> {
    return await this.scheduleService.createSchedule(body);
  }
}
