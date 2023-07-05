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
import {ApiOperation, ApiResponse} from '@nestjs/swagger';

import {
  CreateCICORequest,
  CreateDayOffRequest,
  CreateWorkFromHomeRequest,
} from './request/createRequest';
import {RequestService} from './request.service';
import {AuthService} from '../auth/auth.service';
import {Roles} from '../auth/roles.decorator';
import {Role} from 'src/shared/enums';
import { AcceptRequestBody } from './request/acceptRequest';
@Controller('request')
// @Roles(Role.ADMIN, Role.SUPER_ADMIN)
export class RequestController {
  constructor(
    private readonly requestService: RequestService,
    private readonly authService: AuthService
  ) {}

  @Post('/create-cico-request')
  @Roles(Role.USER, Role.ADMIN, Role.SUPER_ADMIN)
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ['request'],
    operationId: 'user create ci/co request',
    summary: 'user create ci/co request',
    description: 'user create ci/co request',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  async createCICORequest(
    @Body() body: CreateCICORequest,
    @Request() request: any
  ): Promise<any> {
    const {tenantId, userId} = await this.authService.extractFieldsFromToken(
      request
    );
    if (!tenantId || !userId) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }
    return await this.requestService.createCICORequest(body, tenantId, userId);
  }

  @Post('/create-day-off-request')
  @Roles(Role.USER, Role.ADMIN, Role.SUPER_ADMIN)
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ['request'],
    operationId: 'user create day off request',
    summary: 'user create day off request',
    description: 'user create day off request',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  async createDayOffRequest(
    @Body() body: CreateDayOffRequest,
    @Request() request: any
  ): Promise<any> {
    const {tenantId, userId} = await this.authService.extractFieldsFromToken(
      request
    );
    if (!tenantId || !userId) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }
    return await this.requestService.createDayOffRequest(
      body,
      tenantId,
      userId
    );
  }

  @Post('/create-work-from-home-request')
  @Roles(Role.USER, Role.ADMIN, Role.SUPER_ADMIN)
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ['request'],
    operationId: 'user create work from home request',
    summary: 'user create work from home request',
    description: 'user create work from home request',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  async createWFHRequest(
    @Body() body: CreateWorkFromHomeRequest,
    @Request() request: any
  ): Promise<any> {
    const {tenantId, userId} = await this.authService.extractFieldsFromToken(
      request
    );
    if (!tenantId || !userId) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }
    return await this.requestService.createWorkFromHomeRequest(
      body,
      tenantId,
      userId
    );
  }
  //admin handle request
  @Post('/accept-cico-request')
  @Roles(Role.USER, Role.ADMIN, Role.SUPER_ADMIN)
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ['request'],
    operationId: 'admin accept ci/co request',
    summary: 'admin accept ci/co request',
    description: 'admin accept ci/co request',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  async acceptCICORequest(
    @Body() body: AcceptRequestBody,
    @Request() request: any
  ): Promise<any> {
    const {tenantId, userId} = await this.authService.extractFieldsFromToken(
      request
    );
    if (!tenantId || !userId) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }
    // return await this.requestService.createCICORequest(body, tenantId, userId);
  }
}
