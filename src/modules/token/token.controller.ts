import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Query,
  Post,
  Param,
  Req,
  Put,
  UseGuards,
} from '@nestjs/common';
import {ApiOperation, ApiResponse} from '@nestjs/swagger';
import {TokenService} from './token.service';
import {EmptyObject} from '../../shared/response/emptyObject.dto';
import {TokenUpdateStatus} from './request/UpdateStatus.dto';
import RequestWithUser from '../admin/requestWithUser.interface';
import {PageOptionsDto} from '../../shared/Request/baseRequest.dto';
import {TokenBase} from './response/TokenBase.dto';
import {TokenBaseResponsePagination} from './response/TokenBaseResponsePagination.dto';
import {TokenFilterRequest} from './request/TokenFilterRequest.dto';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';
import {TokenRequest} from './request/TokenRequest.dto';
import {TokenUpdateRequest} from './request/TokenUpdateRequest.dto';

@Controller('tokens')
export class TokenController {
  constructor(private tokenService: TokenService) {}

  @Get('')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ['token'],
    operationId: 'list token',
    summary: 'list token',
    description: 'list token',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: TokenBaseResponsePagination,
  })
  async listToken(
    @Query() pageOptions: PageOptionsDto,
    @Query() tokenFilter: TokenFilterRequest
  ) {
    return this.tokenService.getTokens(pageOptions, tokenFilter);
  }

  @Post('')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ['token'],
    operationId: 'create token',
    summary: 'create token by super admin',
    description: 'create token by super admin',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: TokenBase,
  })
  async createTokenV2(
    @Body() data: TokenRequest
  ): Promise<TokenBase | EmptyObject> {
    return this.tokenService.createTokenMultichain(data);
  }

  @Put('/:id/change-status')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ['token'],
    operationId: 'update status token',
    summary: 'update status token',
    description: 'update status token',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: EmptyObject,
  })
  async updateStatus(
    @Param('id') id: number,
    @Body() data: TokenUpdateStatus,
    @Req() request: RequestWithUser
  ): Promise<any | EmptyObject> {
    // if (!request || !request.user) throw Causes.USER_DONT_HAVE_PERMISSION;
    // const checkPermission = await this.authService.checkPermissionUser(
    //   request.user
    // );
    // if (!checkPermission) {
    //   throw Causes.USER_DONT_HAVE_PERMISSION;
    // }
    return await this.tokenService.updateStatus(id, data);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ['token'],
    operationId: 'update token',
    summary: 'update token by super admin',
    description: 'update token by super admin',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: TokenBase,
  })
  async updateToken(
    @Param('id') id: number,
    @Body() data: TokenUpdateRequest
  ): Promise<TokenBase | EmptyObject> {
    return this.tokenService.update(id, data);
  }
}
