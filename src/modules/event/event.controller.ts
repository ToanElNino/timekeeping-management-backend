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
import {EmptyObject} from '../../shared/response/emptyObject.dto';
import {EventRequest} from './request/EventRequest.dto';
import {PaginationResponse} from '../../config/rest/paginationResponse';
import {Pagination} from '../../config/rest/pagination';
import {PageOptionsDto} from '../../shared/Request/baseRequest.dto';
import {UserWalletRequestDto} from '../../shared/Request/UserWalletRequest.dto';
import {GetEventResponse} from './response/EventResponse.dto';
import {EventBaseResponsePagination} from './response/EventBasePagination.dto';
import {EventService} from './event.service';
import {Event} from 'src/database/entities';
import {CreateEventRequest} from './request/CreateEventReq.dto';
import {CreateEventBaseResponse} from './response/CreateEventBase.dto';
import {UpdateEventBaseResponse} from './response/UpdateEventBase.dto';
import {UpdateEventRequest} from './request/UpdateEventReq.dto';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ['event'],
    operationId: 'list all event',
    summary: 'list all event',
    description: 'list all event',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: EventBaseResponsePagination,
  })
  @ApiQuery({
    name: 'status', // active || inactive
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'type', // active || inactive
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'keyWord',
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
  getListEvent(
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('limit', new DefaultValuePipe(10)) limit: number,
    @Query('status') status: string,
    @Query('type') type: string,
    @Query('keyWord') keyWord: string,
    @Req() request: any
  ): Promise<PaginationResponse<Event>> {
    return this.eventService.getListEvents(
      {status, keyWord, type},
      {page, limit}
    );
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ['event'],
    operationId: 'Create event',
    summary: 'Create event by admin',
    description: 'Create event by admin',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: CreateEventBaseResponse,
  })
  async createAnEvent(@Body() body: CreateEventRequest): Promise<any> {
    const res = this.eventService.createNewEvent(body);
    return res;
  }

  @Put('/')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ['event'],
    operationId: 'Update event',
    summary: 'Update event by admin',
    description: 'Update event by admin',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: UpdateEventBaseResponse,
  })
  async updateEvent(@Body() body: UpdateEventRequest): Promise<any> {
    const res = this.eventService.updateEvent(body);
    return res;
  }
}
