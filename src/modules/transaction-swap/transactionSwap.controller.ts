/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpStatus,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {ApiOperation, ApiQuery, ApiResponse} from '@nestjs/swagger';
import {TransactionSwapService} from './transactionSwap.service';
import {TransactionSwapBaseResponsePagination} from './response/TransactionSwapBaseResponsepagination';
import {PaginationResponse} from 'src/config/rest/paginationResponse';
import {TransactionSwap} from 'src/database/entities';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';

@Controller('swap-transactions')
export class TransactionSwapController {
  constructor(
    private readonly transactionSwapService: TransactionSwapService
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ['swap-transactions'],
    operationId: 'get list swap transaction',
    summary: 'get list swap transaction',
    description: 'get list swap transaction',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: TransactionSwapBaseResponsePagination,
  })
  @ApiQuery({
    name: 'status', // active || inactive
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
    @Query('status') status: string
  ): Promise<any> {
    return this.transactionSwapService.getListTransactionSwap(
      {status},
      {page, limit}
    );
  }
}
