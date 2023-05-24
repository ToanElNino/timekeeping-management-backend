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
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {ApiOperation, ApiQuery, ApiResponse} from '@nestjs/swagger';
import {Notification, SystemWallet} from '../../database/entities';
import {Causes} from '../../config/exception/causes';
import {TrimPipe} from '../../shared/TrimPipe';
import {SystemWalletService} from './systemWallet.service';
import {PaginationResponse} from 'src/config/rest/paginationResponse';
import {CreateSystemWalletResponse} from './response/create-system-wallet.response';
import {CreateSystemWalletReq} from './request/create-system-wallet';
import {ChangeWalletStatusReq} from './request/change-wallet-status';
import {SystemWalletBaseResponsePagination} from './response/SystemWalletBaseResponsePagination.dto';
import {CreateSystemWalletBaseResponse} from './response/CreateSystemWalletBaseResponse.dto';
import {GetSystemWalletBaseResponse} from './response/GetSystemWalletBaseResponse';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';

@Controller('system-wallets')
export class SystemWalletController {
  constructor(private readonly systemWalletService: SystemWalletService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ['system-wallet'],
    operationId: 'get list system wallet',
    summary: 'get list system wallet',
    description: 'get list system wallet',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: SystemWalletBaseResponsePagination,
  })
  @ApiQuery({
    name: 'status', // active || inactive
    required: false,
    type: String,
    description: 'active hoặc inactive hoặc để rỗng',
  })
  @ApiQuery({
    name: 'name',
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
  async getListSystemWallet(
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('limit', new DefaultValuePipe(10)) limit: number,
    @Query('name') name: string,
    @Query('status') status: string,
    @Req() request: any
  ): Promise<PaginationResponse<SystemWallet>> {
    return this.systemWalletService.getListSystemWallet(
      {status, name},
      {page, limit}
    );
  }

  @Get('get-an-item')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ['system-wallet'],
    operationId: 'get a system wallet',
    summary: 'get a system wallet',
    description: 'get a system wallet',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: GetSystemWalletBaseResponse,
  })
  @ApiQuery({
    name: 'system_wallet',
    required: true,
    type: String,
  })
  @ApiQuery({
    name: 'chain_id',
    required: true,
    type: Number,
  })
  async getASystemWallet(
    @Query('system_wallet') system_wallet: string,
    @Query('chain_id') chain_id: number,
    @Req() request: any
  ): Promise<any> {
    // console.log('system_wallet: ', system_wallet);
    // console.log('chain_id: ', chain_id);
    const res = await this.systemWalletService.getASystemWallet(
      system_wallet,
      chain_id
    );
    if (!res) {
      return {};
    }
    if (res.privateKey) delete res.privateKey;
    // console.log('res: ', res);
    return res;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ['system-wallet'],
    operationId: 'Create a new wallet',
    summary: 'Create a new wallet',
    description: 'Create a new wallet',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: CreateSystemWalletBaseResponse,
  })
  async createASystemWallet(
    @Req() request: any,
    @Body() body: CreateSystemWalletReq
  ): Promise<CreateSystemWalletResponse> {
    const res = this.systemWalletService.createNewSystemWallet(body);
    return res;
  }

  @Put('/change-status')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ['system-wallet'],
    operationId: 'Change system wallet status',
    summary: 'Change system wallet status',
    description: 'Change system wallet status',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: GetSystemWalletBaseResponse,
  })
  async changeStatus(
    @Req() request: any,
    @Body() body: ChangeWalletStatusReq
  ): Promise<any> {
    // console.log('body: ', body);
    const res = await this.systemWalletService.changeStatus(body);
    return res;
  }
}
