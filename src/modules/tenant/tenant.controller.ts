/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiConsumes,
} from '@nestjs/swagger';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';
import {TenantService} from './tenant.service';
import {CreateTenantBody} from './request/create-tenant';
import {FileInterceptor} from '@nestjs/platform-express';
import {UpdateStatusTenantBody} from './request/update-status';

@Controller('tenant')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}
  @Get('')
  @ApiOperation({
    tags: ['tenant'],
    operationId: 'admin get list tenant',
    summary: 'admin get list tenant',
    description: 'admin get list tenant',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
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
  @ApiQuery({
    name: 'keyWord',
    required: false,
    type: String,
  })
  userGetListTimeSheet(
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('limit', new DefaultValuePipe(10)) limit: number,
    @Query('keyWord') keyWord: String
  ): Promise<any> {
    return this.tenantService.getListTenant(
      {page, limit},
      {
        keyWord,
      }
    );
  }
  @Post()
  @UseInterceptors(FileInterceptor('iconFile'))
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
  @ApiConsumes('multipart/form-data')
  async createTenant(
    @UploadedFile() iconFile: Express.Multer.File,
    @Body() body: CreateTenantBody
  ): Promise<any> {
    const res = this.tenantService.createNewTenant(body);
    return res;
  }
  @Put()
  @UseInterceptors(FileInterceptor('iconFile'))
  @ApiOperation({
    tags: ['tenant'],
    operationId: 'Update tenant',
    summary: 'Update tenant by super admin or admin',
    description: 'Update tenant by super admin or admin',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  @ApiConsumes('multipart/form-data')
  async updateTenant(
    @UploadedFile() iconFile: Express.Multer.File,
    @Body() body: CreateTenantBody
  ): Promise<any> {
    const res = this.tenantService.updateTenant(body);
    return res;
  }

  @Put(':id/change-status')
  @ApiOperation({
    tags: ['tenant'],
    operationId: 'Super admin update tenant status',
    summary: 'Super admin update tenant status',
    description: 'Super admin update tenant status',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  async updateStatusChain(
    @Body() body: UpdateStatusTenantBody,
    @Param('id') id: number
  ): Promise<any> {
    return await this.tenantService.updateStatus(id, body);
  }
}
