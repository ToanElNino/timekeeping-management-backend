/* eslint-disable @typescript-eslint/no-unused-vars */
import {Body, Controller, HttpStatus, Post, UseGuards} from '@nestjs/common';
import {ApiOperation, ApiQuery, ApiResponse} from '@nestjs/swagger';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';
import {TenantService} from './tenant.service';
import {CreateTenantBody} from './request/create-tenant';

@Controller('tenant')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post('/')
  @ApiOperation({
    tags: ['tenant'],
    operationId: 'Create tenant',
    summary: 'Create tenant by super admin',
    description: 'Create tenant by super admin',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  async createAnEvent(@Body() body: CreateTenantBody): Promise<any> {
    const res = this.tenantService.createNewTenant(body);
    return res;
  }
}
