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
  Request,
  HttpException,
} from '@nestjs/common';
import {ApiOperation, ApiQuery, ApiResponse} from '@nestjs/swagger';
import {TimeSheetService} from './TimeSheet.service';
import {AuthService} from '../auth/auth.service';

@Controller('time-sheet')
// @Roles(Role.ADMIN, Role.SUPER_ADMIN)
export class TimeSheetController {
  constructor(
    private readonly timeSheetService: TimeSheetService,
    private readonly authService: AuthService
  ) {}

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
    name: 'page',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
  })
  async userGetListTimeSheet(
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('limit', new DefaultValuePipe(10)) limit: number,
    @Query('month') month: string,
    @Query('day') day: string,
    @Request() request: any
  ): Promise<any> {
    const {tenantId, userId} = await this.authService.extractFieldsFromToken(
      request
    );
    if (!tenantId || !userId) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }
    return await this.timeSheetService.getListCheckinLog(
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
