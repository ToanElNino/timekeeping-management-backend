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
import {TimeSheetService} from './TimeSheet.service';

@Controller('time-sheet')
// @Roles(Role.ADMIN, Role.SUPER_ADMIN)
export class TimeSheetController {
  constructor(private readonly timeSheetService: TimeSheetService) {}

  @Get('user-get-time-sheet')
  @ApiOperation({
    tags: ['time-sheet'],
    operationId: 'user get list time sheet',
    summary: 'user get list time sheet',
    description: 'user get list time sheet',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  @ApiQuery({
    name: 'month',
    required: true,
    type: String,
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
  userGetListTimeSheet(
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('limit', new DefaultValuePipe(10)) limit: number,
    @Query('month') month: string,
    @Query('day') day: string,
    @Query('tenantId') tenantId: number,
    @Query('userId') userId: number
  ): Promise<any> {
    return this.timeSheetService.getListCheckinLog(
      {page, limit},
      {
        tenantId,
        userId,
        month,
        day,
      }
    );
  }
}
