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
  HttpException,
} from '@nestjs/common';
import {ApiOperation, ApiQuery, ApiResponse} from '@nestjs/swagger';
import {CreateAdminRequest} from './request/createAdmin';
import {AdminService} from './admin.service';
import {
  AdminChangePasswordBody,
  UserChangePasswordBody,
} from './request/changePassword';
import {Roles} from '../auth/roles.decorator';
import {Role} from 'src/shared/enums';
import {Causes} from 'src/config/exception/causes';
import {AuthService} from '../auth/auth.service';

@Controller('')
// @Roles(Role.ADMIN, Role.SUPER_ADMIN)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly authService: AuthService
  ) {}
  @Get('admin/get-list-admin-account')
  @ApiOperation({
    tags: ['account'],
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
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'roleId',
    required: true,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
  })
  userGetListAdminAccount(
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('limit', new DefaultValuePipe(10)) limit: number,
    @Query('roleId', new DefaultValuePipe(0)) roleId: number,
    @Query('tenantId') tenantId?: number,
    @Query('status') status?: string
  ): Promise<any> {
    return this.adminService.getListAdminAccount(
      {page, limit},
      {
        tenantId,
        status,
        roleId,
      }
    );
  }

  @Post('admin/super-admin-create-admin-account')
  // @Roles(Role.SUPER_ADMIN)
  @ApiOperation({
    tags: ['account'],
    operationId: 'super admin create a admin',
    summary: 'super admin create a admin',
    description: 'super admin create a admin',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  async createAdmin(@Body() body: CreateAdminRequest): Promise<any> {
    return await this.adminService.createAdmin(body);
  }

  @Put('admin/change-password-account')
  // @Roles(Role.SUPER_ADMIN)
  @ApiOperation({
    tags: ['account'],
    operationId: 'admin update account password',
    summary: 'admin update account password',
    description: 'admin update account password',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  async adminChangeAccountPassword(
    @Body() body: AdminChangePasswordBody
  ): Promise<any> {
    return await this.adminService.adminChangePassword(body);
  }

  @Put('user/change-password-account')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.USER)
  @ApiOperation({
    tags: ['account'],
    operationId: 'user update account password',
    summary: 'user update account password',
    description: 'user update account password',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  async updateAccountPassword(
    @Body() body: UserChangePasswordBody,
    @Req() request: any
  ): Promise<any> {
    const {tenantId, accountId} = await this.authService.extractFieldsFromToken(
      request
    );
    if (!tenantId || !accountId) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }
    return await this.adminService.userUpdateAccountPassword(
      body,
      tenantId,
      accountId
    );
  }
}
