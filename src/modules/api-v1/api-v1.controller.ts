import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {ApiV1Service} from './api-v1.service';
import {ApiOperation, ApiQuery, ApiResponse} from '@nestjs/swagger';
import {ApiKeyPaginateResponseBase} from './response/api-key-base-paginate-response.dto';
import {ApiKeyResponseBase} from './response/api-key-base-response.dto';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';
import {Causes} from '../../config/exception/causes';
import {AdminService} from '../admin/admin.service';
import {PagingDto} from './request/paging.dto';
import {UpdateStatusApi} from './request/update-status.dto';
import {ApiKeyResponse} from './response/api-key-response.dto';
import {KeyApiFilter} from './request/KeyApiFilter.dto';

@Controller('api-keys')
export class ApiV1Controller {
  constructor(
    private readonly apiV1Service: ApiV1Service,
    private authService: AdminService
  ) {}

  // Return a valid ApiKey for client to use
  @Post('')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ['api-keys'],
    operationId: 'post-api-key',
    summary: 'Create a new api key',
    description: 'Create a new api key',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: ApiKeyResponseBase,
  })
  async createKey(@Req() request: any): Promise<ApiKeyResponseBase | any> {
    if (
      !request ||
      !request.user ||
      !request.user.id ||
      !(await this.authService.isActive(request.user))
    )
      throw Causes.USER_DONT_HAVE_PERMISSION;

    return this.apiV1Service.createApiKey();
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ['api-keys'],
    operationId: 'get-api-key',
    summary: 'List of api keys',
    description: 'List of api keys',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: ApiKeyPaginateResponseBase,
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
  async getKey(
    @Query() paginateQuery: PagingDto,
    @Query() keyApiFilter: KeyApiFilter,
    @Req() request
  ): Promise<any> {
    if (
      !request ||
      !request.user ||
      !request.user.id ||
      !(await this.authService.isActive(request.user))
    )
      throw Causes.USER_DONT_HAVE_PERMISSION;

    return this.apiV1Service.getListApi(paginateQuery, keyApiFilter);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ['api-keys'],
    operationId: 'api-keys-detail',
    summary: 'Api keys detail',
    description: 'Api keys detail',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: ApiKeyResponseBase,
  })
  async detail(@Param('id') id: number, @Req() request): Promise<any> {
    if (
      !request ||
      !request.user ||
      !request.user.id ||
      !(await this.authService.isActive(request.user))
    )
      throw Causes.USER_DONT_HAVE_PERMISSION;

    return this.apiV1Service.detail(id);
  }

  @Put(':id/change-status')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ['api-keys'],
    operationId: 'api-keys-update-status',
    summary: 'Api keys update status',
    description: 'Api keys update status',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: ApiKeyResponseBase,
  })
  async updateStatus(
    @Param('id') id: number,
    @Body() data: UpdateStatusApi
  ): Promise<ApiKeyResponse> {
    return this.apiV1Service.updateStatus(id, data);
  }
}
