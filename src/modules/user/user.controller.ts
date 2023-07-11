import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpException,
  HttpStatus,
  Put,
  Post,
  Query,
  Req,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {Login} from './request/login.dto';
import {LoginResponse} from './response/login.dto';
import {EmptyObject} from '../../shared/response/emptyObject.dto';
import {
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import {UserService} from './user.service';
import {User} from '../../database/entities/User.entity';
import {PaginationResponse} from '../../config/rest/paginationResponse';
import {UserBaseResponsePagination} from './response/UserBasePagination.dto';
import {Role} from 'src/shared/enums';
import {Roles} from '../auth/roles.decorator';
import {AuthService} from '../auth/auth.service';
import {FileInterceptor} from '@nestjs/platform-express';
import {
  AdminCreateStaffRequest,
  StaffUpdateAvatarRequest,
  StaffUpdateProfileRequest,
  UpdateProfileRequest,
} from './request/updateProfile';

@Controller('')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  @Get('')
  // @UseGuards(JwtAuthGuard)
  // @Roles(Role.ADMIN, Role.SUPER_ADMIN)
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

  @Get('/admin/get-list-staff')
  @Roles(Role.ADMIN, Role.ADMIN)
  @ApiOperation({
    tags: ['staff'],
    operationId: 'admin or user get list tenant staff',
    summary: 'admin or user get list tenant staff',
    description: 'admin or user get list tenant staff',
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
    name: 'departmentId',
    description: '0 to get all',
    required: true,
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
  async adminGetListTenantStaff(
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('limit', new DefaultValuePipe(10)) limit: number,
    @Query('departmentId', new DefaultValuePipe(0)) departmentId: number,
    @Query('status') status: string,
    @Query('keyWord') keyWord: string,
    @Req() request: any
  ): Promise<PaginationResponse<User>> {
    const {tenantId} = await this.authService.extractFieldsFromToken(request);
    if (!tenantId) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }

    return this.userService.getListEndUser(
      {status, keyWord, tenantId, departmentId},
      {page, limit}
    );
  }

  @Get('/staff/get-profile')
  @ApiOperation({
    tags: ['staff'],
    operationId: 'Staff get staff profile',
    summary: 'Staff get staff profile',
    description: 'Staff get staff profile',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  async staffGetProfile(@Request() request: any): Promise<any> {
    const {userId, accountId, tenantId} =
      await this.authService.extractFieldsFromToken(request);
    if (!userId) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }
    const res = await this.userService.staffGetProfile(
      userId,
      accountId,
      tenantId
    );
    return res;
  }

  @Put('/admin/admin-update-staff-profile')
  @UseInterceptors(FileInterceptor('avatarFile'))
  @ApiOperation({
    tags: ['staff'],
    operationId: 'Admin update staff profile',
    summary: 'Admin update staff profile',
    description: 'Update chain',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  @ApiConsumes('multipart/form-data')
  async adminUpdateStaffProfile(
    @UploadedFile() avatarFile: Express.Multer.File,
    @Body() body: UpdateProfileRequest
  ): Promise<any> {
    const res = await this.userService.adminUpdateStaffProfile(
      avatarFile,
      body
    );
    return res;
  }

  @Post('/admin/create-staff')
  @UseInterceptors(FileInterceptor('avatarFile'))
  @ApiOperation({
    tags: ['staff'],
    operationId: 'Admin create staff',
    summary: 'Admin create staff',
    description: 'Admin create staff',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  @ApiConsumes('multipart/form-data')
  async adminUpdateStaff(
    @UploadedFile() avatarFile: Express.Multer.File,
    @Body() body: AdminCreateStaffRequest,
    @Request() request: any
  ): Promise<any> {
    const {tenantId} = await this.authService.extractFieldsFromToken(request);
    if (!tenantId) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }
    const res = await this.userService.adminCreateStaff(
      avatarFile,
      body,
      tenantId
    );
    return res;
  }

  @Put('/user/staff-update-profile')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.USER)
  @ApiOperation({
    tags: ['staff'],
    operationId: 'staff update profile',
    summary: 'staff update profile',
    description: 'staff update profile',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  async staffUpdateProfile(
    @Body() body: StaffUpdateProfileRequest,
    @Request() request: any
  ): Promise<any> {
    const {userId} = await this.authService.extractFieldsFromToken(request);
    if (!userId) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }
    const res = await this.userService.staffUpdateProfile(body, userId);
    return res;
  }

  @Put('/user/staff-update-avatar')
  @UseInterceptors(FileInterceptor('avatarFile'))
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.USER)
  @ApiOperation({
    tags: ['staff'],
    operationId: 'staff update avatar',
    summary: 'staff update avatar',
    description: 'staff update avatar',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  @ApiConsumes('multipart/form-data')
  async staffUpdateAvatar(
    @UploadedFile() avatarFile: Express.Multer.File,
    @Body() body: StaffUpdateAvatarRequest,
    @Request() request: any
  ): Promise<any> {
    const {userId} = await this.authService.extractFieldsFromToken(request);
    if (!userId) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }
    if (!avatarFile) {
      throw new HttpException('No image selected', HttpStatus.BAD_REQUEST);
    }
    const res = await this.userService.staffUpdateAvatar(avatarFile, userId);
    return res;
  }
}
