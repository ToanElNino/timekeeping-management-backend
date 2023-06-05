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

import {CreateRequest} from './request/createRequest';
import {RequestService} from './request.service';
@Controller('request')
// @Roles(Role.ADMIN, Role.SUPER_ADMIN)
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post('/user-create-request')
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ['request'],
    operationId: 'user create request',
    summary: 'user create request',
    description: 'user create request',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  async pushALog(@Body() body: CreateRequest): Promise<any> {
    return await this.requestService.createRequest(body);
  }
}
