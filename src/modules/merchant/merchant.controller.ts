/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {ApiOperation, ApiResponse} from '@nestjs/swagger';
import {Pagination} from '../../config/rest/pagination';
import {PaginationResponse} from '../../config/rest/paginationResponse';
import {BaseResponse} from '../../shared/response/baseResponse.dto';
import {EmptyObject} from '../../shared/response/emptyObject.dto';
import {MerchantService} from './merchant.service';
import {CreateMerchantRequest} from './request/CreateMerchantRequest.dto';
import {GetListMerchantRequest} from './request/GetListMerchantRequest.dto';
import {UpdateStatusRequest} from './request/UpdateStatus.dto';
import {MerchantBaseResponsePagination} from './response/MerchantBaseResponsePagination.dto';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';

@Controller('merchants')
export class MerchantController {
  constructor(private merchantService: MerchantService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ['merchant'],
    operationId: 'list all merchant',
    summary: 'list all merchant',
    description: 'list all merchant',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: MerchantBaseResponsePagination,
  })
  async getMerchants(@Query() request: GetListMerchantRequest) {
    let pagingMeta = {
      itemCount: Number(request.limit),
      totalItems: Number(request.limit),
      itemsPerPage: Number(request.limit),
      totalPages: 10,
      currentPage: Number(request.page),
    };
    let merchants;
    if (request.page) {
      const {limit, page} = request;
      const {result, total} = await this.merchantService.getMerchantWithPage(
        limit,
        page,
        request.name,
        request.status
      );
      merchants = result;
      pagingMeta = {
        itemCount: Number(request.limit),
        totalItems: Number(total),
        itemsPerPage: Number(request.limit),
        totalPages: Number(
          total % request.limit === 0
            ? total / request.limit
            : Math.ceil(total / request.limit)
        ),
        currentPage: Number(request.page),
      };
      const paging = new Pagination(pagingMeta);
      return new PaginationResponse(merchants, paging);
    }
    merchants = await this.merchantService.getAllMerchant();
    return merchants;
  }

  @Get('/:merchant_wallet')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ['merchant'],
    operationId: 'get merchant',
    summary: 'get by merchant wallet',
    description: 'Create merchant by merchant wallet',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: BaseResponse,
  })
  async getMerchant(@Param() params: {merchant_wallet: string}) {
    const merchant = await this.merchantService.getMerchantByMerchantAddress(
      params?.merchant_wallet
    );
    if (merchant) {
      return merchant;
    }
    return {
      message: 'Merchant not exist',
    };
  }
  @Post('/')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ['merchant'],
    operationId: 'Create merchant',
    summary: 'Create merchant by admin',
    description: 'Create merchant by admin',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: BaseResponse,
  })
  async createMerchant(@Body() data: CreateMerchantRequest) {
    const newMerchant = {
      name: data.name,
      avatar: data.avatar,
      longitude: data.longitude,
      latitude: data.latitude,
      merchant_wallet: data.merchant_wallet,
      address: data.address,
      status: 'ACTIVE',
    };
    const checkExist = await this.merchantService.checkExistMerchant(
      data.merchant_wallet
    );
    if (checkExist) {
      return {
        message: 'Duplicate Merchant Wallet',
      };
    }
    await this.merchantService.createMerchant(newMerchant);
    return {
      message: 'Create Merchant Successful',
    };
  }

  @Put(':merchant_wallet')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ['merchant'],
    operationId: 'Update merchant',
    summary: 'Update merchant by admin',
    description: 'Update merchant by admin',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: BaseResponse,
  })
  async updateMerchant(
    @Body() data: CreateMerchantRequest,
    @Param() params: {merchant_wallet: string}
  ) {
    const {merchant_wallet} = params;
    const newDataMerchant = {
      name: data.name,
      avatar: data.avatar,
      longitude: data.longitude,
      latitude: data.latitude,
      merchant_wallet: data.merchant_wallet,
      address: data.address,
      status: 'ACTIVE',
    };
    await this.merchantService.updateMerchant(newDataMerchant, merchant_wallet);
    return {
      message: 'Update Merchant Successful',
    };
  }

  @Put('/:merchant_wallet/change-status')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ['merchant'],
    operationId: 'update status merchant',
    summary: 'update status merchant',
    description: 'update status merchant',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: EmptyObject,
  })
  async updateStatus(
    @Body() data: UpdateStatusRequest,
    @Param('merchant_wallet') merchant_wallet: string
  ) {
    await this.merchantService.updateStatus(
      data.status === 1 ? 'ACTIVE' : 'INACTIVE',
      merchant_wallet
    );
    return {
      message: `${
        data.status === 1 ? 'ACTIVE' : 'INACTIVE'
      } Merchant Successful`,
    };
  }

  @Post('/:merchant_wallet/approve-merchant')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ['merchant'],
    operationId: 'update status merchant',
    summary: 'update status merchant',
    description: 'update status merchant',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: EmptyObject,
  })
  async approveMerchant(@Param('merchant_wallet') merchant_wallet: string) {
    await this.merchantService.updateStatus('ACTIVE', merchant_wallet);
    return {
      message: 'APPROVE Merchant Successful',
    };
  }

  @Post('/:merchant_wallet/reject-merchant')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ['merchant'],
    operationId: 'update status merchant',
    summary: 'update status merchant',
    description: 'update status merchant',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: EmptyObject,
  })
  async rejectMerchant(@Param('merchant_wallet') merchant_wallet: string) {
    await this.merchantService.updateStatus('REJECTED', merchant_wallet);
    return {
      message: 'REJECTED Merchant Successful',
    };
  }
}
