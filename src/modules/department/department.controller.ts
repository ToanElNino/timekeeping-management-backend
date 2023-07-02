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
import {DepartmentService} from './department.service';
import {CreateDepartmentRequest} from './request/createDepartment';
import {UpdateDepartmentRequest} from './request/updateDepartment';
import {DeleteDepartmentRequest} from './request/deleteDepartment';

@Controller('department')
// @Roles(Role.ADMIN)
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Get('get-list-department-tenant')
  @ApiOperation({
    tags: ['department'],
    operationId: 'tenant get list ',
    summary: 'tenant get list department',
    description: 'tenant get list department',
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
    return this.departmentService.getListCheckDepartmentForTenant(
      {page, limit},
      {
        tenantId,
      }
    );
  }

  @Get(':id')
  @ApiOperation({
    tags: ['department'],
    operationId: 'tenant admin get department',
    summary: 'tenant admin get department',
    description: 'tenant admin get department',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  async updateStatusChain(@Param('id') id: number): Promise<any> {
    return await this.departmentService.getATenantDepartment(id);
  }

  @Post('/create-department')
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ['department'],
    operationId: 'admin create a department for tenant',
    summary: 'admin create a department for tenant',
    description: 'admin create a department for tenant',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  async pushALog(@Body() body: CreateDepartmentRequest): Promise<any> {
    return await this.departmentService.createDepartment(body);
  }

  @Put('/update-department')
  @ApiOperation({
    tags: ['department'],
    operationId: 'admin update a department for tenant',
    summary: 'admin update a department for tenant',
    description: 'admin update a department for tenant',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  async updateDepartment(@Body() body: UpdateDepartmentRequest): Promise<any> {
    return await this.departmentService.updateDepartment(body);
  }

  @Put('/delete-department')
  @ApiOperation({
    tags: ['department'],
    operationId: 'admin delete a department for tenant',
    summary: 'admin delete a department for tenant',
    description: 'admin delete a department for tenant',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  async deleteDepartment(@Body() body: DeleteDepartmentRequest): Promise<any> {
    return await this.departmentService.deleteDepartment(body);
  }
}
