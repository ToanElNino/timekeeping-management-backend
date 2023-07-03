/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Request,
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
import {UpdateTenantBody} from './request/update-tenant';
import {AuthService} from '../auth/auth.service';

@Controller('tenant')
export class TenantController {
  constructor(
    private readonly tenantService: TenantService,
    private readonly authService: AuthService
  ) {}
  @Get('superadmin/get-list-tenant')
  @ApiOperation({
    tags: ['tenant'],
    operationId: 'super admin get list tenant',
    summary: 'super admin admin get list tenant',
    description: 'super admin admin get list tenant',
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
  @Post('superadmin/create-tenant')
  @UseInterceptors(FileInterceptor('iconFile'))
  @ApiOperation({
    tags: ['tenant'],
    operationId: 'Super admin create tenant',
    summary: 'Super admin create tenant',
    description: 'Super admin create tenant',
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
    const res = this.tenantService.createNewTenant(body, iconFile);
    return res;
  }
  @Put('superadmin/update-tenant')
  @UseInterceptors(FileInterceptor('iconFile'))
  @ApiOperation({
    tags: ['tenant'],
    operationId: 'Super admin update tenant',
    summary: 'Super admin update tenant',
    description: 'Super admin update tenant',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  @ApiConsumes('multipart/form-data')
  async superAdminUpdateTenant(
    @UploadedFile() iconFile: Express.Multer.File,
    @Body() body: UpdateTenantBody
  ): Promise<any> {
    const res = this.tenantService.updateTenant(body, iconFile);
    return res;
  }

  @Put('admin/update-tenant')
  @UseInterceptors(FileInterceptor('iconFile'))
  @ApiOperation({
    tags: ['tenant'],
    operationId: 'Admin update tenant',
    summary: 'Admin update tenant',
    description: 'Admin update tenant',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  @ApiConsumes('multipart/form-data')
  async adminUpdateTenant(
    @UploadedFile() iconFile: Express.Multer.File,
    @Body() body: CreateTenantBody,
    @Request() request: any
  ): Promise<any> {
    const {tenantId} = await this.authService.extractFieldsFromToken(request);
    if (!tenantId) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }
    const res = this.tenantService.adminUpdateTenant(body, iconFile, tenantId);
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
