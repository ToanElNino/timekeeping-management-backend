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
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import {
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import {TrimPipe} from '../../shared/TrimPipe';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';
import {ChainService} from './chain.service';
import {ChainBaseResponsePagination} from './response/ChainBaseResponsePagination.dto';
import {Chain} from 'src/database/entities';
import {PaginationResponse} from 'src/config/rest/paginationResponse';
import {CreateChainRequest} from './request/CreateChainRequest.dto';
import {CreateChainBaseResponse} from './response/CreateChainBaseResponse.dto';
import {FileInterceptor} from '@nestjs/platform-express';
import {UpdateChainBaseResponse} from './response/UpdateChainBaseResponse.dto';
import {UpdateChainRequest} from './request/UpdateChainRequest.dto';
import {UpdateStatusChainReq} from './request/UpdateStatusChainRequest.dto';
import {UpdateStatusBaseResponse} from './response/UpdateStatusBaseResponse.dto';

@Controller('chains')
export class ChainController {
  constructor(private readonly chainService: ChainService) {}

  @Get('')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ['chains'],
    operationId: 'get-list-chain',
    summary: 'Get list chain',
    description: 'Get list chain',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: ChainBaseResponsePagination,
  })
  @ApiQuery({
    name: 'status', // active || inactive
    required: false,
    type: String,
    description: 'active hoặc inactive hoặc để rỗng',
  })
  @ApiQuery({
    name: 'keyWord',
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
  async getListChain(
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('limit', new DefaultValuePipe(10)) limit: number,
    @Query('status') status: string,
    @Query('keyWord') keyWord: string,
    @Req() request: any
  ): Promise<PaginationResponse<Chain>> {
    return this.chainService.getListChain({status, keyWord}, {page, limit});
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('iconFile'))
  @ApiOperation({
    tags: ['chains'],
    operationId: 'Create a new chain',
    summary: 'Create a new chain',
    description: 'Create a new chain',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: CreateChainBaseResponse,
  })
  @ApiConsumes('multipart/form-data')
  async createAChain(
    @UploadedFile() iconFile: Express.Multer.File,
    @Body() body: CreateChainRequest
  ): Promise<CreateChainBaseResponse> {
    const res = await this.chainService.createNewChain(iconFile, body);
    return res;
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('iconFile'))
  @ApiOperation({
    tags: ['chains'],
    operationId: 'Update chain',
    summary: 'Update chain',
    description: 'Update chain',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: UpdateChainBaseResponse,
  })
  @ApiConsumes('multipart/form-data')
  async updateChain(
    @UploadedFile() iconFile: Express.Multer.File,
    @Body() body: UpdateChainRequest
  ): Promise<any> {
    const res = await this.chainService.updateChain(iconFile, body);
    return res;
  }

  @Put(':id/change-status')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ['chains'],
    operationId: 'Update chain status',
    summary: 'Update chain status',
    description: 'Update chain status',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: UpdateStatusBaseResponse,
  })
  async updateStatusChain(
    @Body() body: UpdateStatusChainReq,
    @Param('id') id: number
  ): Promise<any> {
    console.log(body);
    const res = await this.chainService.updateStatus(id, body);
    return res;
  }
}
