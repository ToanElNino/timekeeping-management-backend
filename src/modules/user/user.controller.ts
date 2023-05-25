import {
  Controller,
  DefaultValuePipe,
  Get,
  HttpStatus,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {Login} from './request/login.dto';
import {LoginResponse} from './response/login.dto';
import {EmptyObject} from '../../shared/response/emptyObject.dto';
import {ApiOperation, ApiQuery, ApiResponse} from '@nestjs/swagger';
import {UserService} from './user.service';
import {User} from '../../database/entities/User.entity';
import {PaginationResponse} from '../../config/rest/paginationResponse';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';
import {UserBaseResponsePagination} from './response/UserBasePagination.dto';
import {Role} from 'src/shared/enums';
import {Roles} from '../auth/roles.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  // @UseGuards(JwtAuthGuard)
  // @Roles(Role.USER)
  @ApiOperation({
    tags: ['user'],
    operationId: 'get-list-end-user',
    summary: 'Get list end user',
    description: 'Get list end user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: UserBaseResponsePagination,
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
    name: 'status', // active || inactive
    required: false,
    type: String,
    description: 'ACTIVE or INACTIVE or empty',
  })
  @ApiQuery({
    name: 'keyWord',
    required: false,
    type: String,
  })
  async getListEndUsers(
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('limit', new DefaultValuePipe(10)) limit: number,
    // @Query('username') username: string,
    // @Query('email') email: string,
    @Query('status') status: string,
    @Query('keyWord') keyWord: string,
    @Req() request: any
  ): Promise<PaginationResponse<User>> {
    return this.userService.getListEndUser({status, keyWord}, {page, limit});
  }
}
