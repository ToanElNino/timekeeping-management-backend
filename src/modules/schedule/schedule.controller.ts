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
import {CreateScheduleRequest} from './request/createSchedule';
import {UpdateScheduleRequest} from './request/updateSchedule';

@Controller('schedule')
// @Roles(Role.ADMIN)
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

  @Get(':id')
  @ApiOperation({
    tags: ['schedule'],
    operationId: 'tenant admin get schedule',
    summary: 'tenant admin get schedule',
    description: 'tenant admin get schedule',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  async updateStatusChain(@Param('id') id: number): Promise<any> {
    return await this.scheduleService.getATenantSchedule(id);
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

  @Put('/update-schedule')
  @ApiOperation({
    tags: ['schedule'],
    operationId: 'admin update a schedule for tenant',
    summary: 'admin update a schedule for tenant',
    description: 'admin update a schedule for tenant',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  async updateSchedule(@Body() body: UpdateScheduleRequest): Promise<any> {
    console.log('update: ', body);
    return await this.scheduleService.updateSchedule(body);
  }
}
