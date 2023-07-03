import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {AdminService} from './admin.service';
import * as argon2 from 'argon2';
import {AdminLogin} from './request/login.dto';
import {AdminLoginResponse} from './response/login.dto';
import {EmptyObject} from '../../shared/response/emptyObject.dto';
import {ApiOperation, ApiQuery, ApiResponse} from '@nestjs/swagger';
import {Causes} from '../../config/exception/causes';
import {EmptyObjectBase} from '../../shared/response/emptyObjectBase.dto';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';
import {CreatePartnership} from './request/createPartnership.dto';
import {CreatePartnershipRes} from './response/createPartnership.dto';
import {RegisterBase} from './response/createPartnershipBase.dto';
import {UpdateAdminPassword} from './request/update-password.dto';
import {JwtService} from '@nestjs/jwt';
import {PaginationResponse} from '../../config/rest/paginationResponse';
import {Admin} from '../../database/entities';
import RequestWithUser from './requestWithUser.interface';
import {AdminResetPassword} from './request/reset-password.dto';
import {MailService} from '../mail/mail.service';
import {UpdateStatus} from './request/update-status.dto';
import {UpdateUserStatus} from './request/update-user-status.dto';
import {CreateAdmin} from './request/create.dto';
import {EmailResetPassword} from './request/email-reset-password.dto';
import {SingleSignOnService} from '../user/sso.service';
import {UpdateClientSecret} from './request/update-client-secret.dto';
import {UpdateEmailPartnerShip} from './request/update-email.dto';
import {
  backStatus,
  createPartnerShip,
  createSuperAdmin,
  resetPassword,
  updateClientSecret,
  updateStatus,
} from '../../shared/emailTemplate';
import {UpdateProfile} from './request/update-profile.dto';
import {AuthToken} from './request/auth-token.dto';

@Controller('admin')
export class AdminController {
  constructor(
    private jwtService: JwtService,
    private authService: AdminService,
    private mailService: MailService
  ) {}

  @Get('')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ['admin'],
    operationId: 'getList admin and partnership',
    summary: 'Get all admins',
    description: 'Get all admins',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: Admin,
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'type',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'username',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'email',
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
  async getList(
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('limit', new DefaultValuePipe(10)) limit: number,
    @Query('username') username: string,
    @Query('email') email: string,
    @Query('status') status: string,
    @Query('type') type: number,
    @Req() request: any
  ): Promise<PaginationResponse<Admin>> {
    if (!request || !request.user) throw Causes.USER_DONT_HAVE_PERMISSION;
    const checkPermission = await this.authService.checkPermissionUser(
      request.user
    );
    if (!checkPermission) {
      throw Causes.USER_DONT_HAVE_PERMISSION;
    }
    return this.authService.getList(
      {username, email, status, type},
      {page, limit}
    );
  }

  @Post('')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ['admin'],
    operationId: 'create partnership    ',
    summary: 'create a partnership by super admin',
    description: 'create a partnership by super admin',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: RegisterBase,
  })
  async createPartnership(
    @Body() data: CreatePartnership,
    @Req() request: RequestWithUser
  ): Promise<CreatePartnershipRes | EmptyObject> {
    if (!request || !request.user) throw Causes.USER_DONT_HAVE_PERMISSION;
    const checkPermission = await this.authService.checkPermissionUser(
      request.user
    );
    if (!checkPermission) {
      throw Causes.USER_DONT_HAVE_PERMISSION;
    }
    const duplicatedUser = await this.authService.checkDuplicatedUser(data);
    if (duplicatedUser) {
      throw Causes.DUPLICATED_ACCOUNT;
    }
    const user = await this.authService.createPartnership(data);

    const sendMail = user.email;
    const subject = 'Your account has been created on our platform';

    const html = createPartnerShip(request.user, data);

    await this.mailService.sendMail(sendMail, subject, html);
    return user;
  }

  @Post('/:id/change-status')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ['admin'],
    operationId: 'update status admin',
    summary: 'update status admin',
    description: 'update status admin',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: RegisterBase,
  })
  async updateStatus(
    @Param('id') id: number,
    @Body() data: UpdateStatus,
    @Req() request: RequestWithUser
  ): Promise<any | EmptyObject> {
    if (!request || !request.user) throw Causes.USER_DONT_HAVE_PERMISSION;
    const checkPermission = await this.authService.checkPermissionUser(
      request.user
    );
    if (!checkPermission) {
      throw Causes.USER_DONT_HAVE_PERMISSION;
    }
    const user = await this.authService.getUserById(id);
    if (!user) {
      throw Causes.USER_WITH_ID_NOT_EXIST;
    }
    const url = 'report@var-meta.com';
    // User freeze user's accounts
    if (user.id == request.user.id) {
      throw Causes.USER_CANNOT_CHANGE_STATUS_OF_YOURSELF;
    }

    const currentStatus = user.status;
    const userUpdated = await this.authService.updateStatus(data.status, user);

    if (!userUpdated) {
      throw Causes.USER_WITH_ID_NOT_EXIST;
    }
    if (data.status === 'INACTIVE' && currentStatus !== data.status) {
      const sendMail = userUpdated.email;
      const subject = 'Your account has been frozen';
      const statusHeader = 'fronzen';
      const status = 'fronzen';

      const html = updateStatus(user, data, url, statusHeader, status);
      await this.mailService.sendMail(sendMail, subject, html);
    } else if (data.status == 'ACTIVE' && currentStatus !== data.status) {
      const sendMail = userUpdated.email;
      const subject = 'Your account has been unfronzen';
      const statusHeader = 'unfronzen';
      const status = 'unfronzen';
      const html = backStatus(user, statusHeader, status);

      await this.mailService.sendMail(sendMail, subject, html);
    }

    delete userUpdated.code;
    delete userUpdated.password;

    return userUpdated;
  }

  @Post('/update-password')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ['admin'],
    operationId: 'update password',
    summary: 'update password for super admin only',
    description: 'update password',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: RegisterBase,
  })
  async updatePassword(
    @Body() data: UpdateAdminPassword,
    @Req() request: RequestWithUser
  ): Promise<any | EmptyObject> {
    if (!request || !request.user) throw Causes.USER_DONT_HAVE_PERMISSION;

    if (!data.oldPassword || !data.newPassword) throw Causes.DATA_INVALID;

    if (data.oldPassword === data.newPassword) throw Causes.DUPLICATE_PASSWORD;

    const user = request.user;
    const userUpdate = await this.authService.updatePassword(user, data);

    if (!userUpdate) throw Causes.DATA_INVALID;

    return userUpdate;
  }

  @Post('/send-email-reset-password/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ['admin'],
    operationId: 'send email reset password',
    summary: 'send email reset password',
    description: 'send email reset password',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: RegisterBase,
  })
  async sendMailResetPass(
    @Param('id') id: number,
    @Req() request: RequestWithUser
  ) {
    if (!request || !request.user) throw Causes.USER_NOT_ACCESS;
    const checkPermission = await this.authService.checkPermissionUser(
      request.user
    );
    if (!checkPermission) {
      throw Causes.USER_NOT_ACCESS;
    }

    const sendUser = await this.authService.getUserById(id);
    const code = await this.authService.genCode();

    await this.authService.updateCode(sendUser, code);

    const sendMail = sendUser.email;
    const subject = 'Reset your password';

    const url =
      process.env.GAME_MARKET_ADMIN_FRONTEND + '/reset-password?code=' + code;
    // let url = "http://localhost:3001/reset-password?code=" + code;

    const html = resetPassword(sendUser, url);

    await this.mailService.sendMail(sendMail, subject, html);

    return true;
  }

  @Post('/send-email-reset-password')
  @ApiOperation({
    tags: ['admin'],
    operationId: 'send email reset password (just api)',
    summary: 'send email reset password',
    description: 'send email reset password',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: RegisterBase,
  })
  async sendMailResetPassApi(
    @Body() data: EmailResetPassword,
    @Req() request: RequestWithUser
  ) {
    const sendUser = await this.authService.getUserByEmail(data.email);
    if (!sendUser) {
      throw Causes.USER_DOES_NOT_EXIST_WITH_THIS_EMAIL;
    }

    const code = await this.authService.genCode();

    await this.authService.updateCode(sendUser, code);

    const sendMail = sendUser.email;
    const subject = 'Reset your password';

    const url =
      process.env.GAME_MARKET_ADMIN_FRONTEND + '/reset-password?code=' + code;
    // let url = "http://localhost:3001/reset-password?code=" + code;
    const html = resetPassword(sendUser, url);

    await this.mailService.sendMail(sendMail, subject, html);

    return true;
  }

  @Post('/reset-password')
  @ApiOperation({
    tags: ['admin'],
    operationId: 'reset password',
    summary: 'reset password',
    description: 'reset password',
  })
  @ApiQuery({
    name: 'code',
    required: false,
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: RegisterBase,
  })
  async resetPassword(
    @Query('code') code: string,
    @Body() data: AdminResetPassword
  ) {
    const {password} = data;
    if (!password) {
      throw Causes.DATA_INVALID;
    }

    try {
      this.jwtService.verify(code, {secret: process.env.JWT_SECRET});
    } catch (error) {
      throw Causes.CODE_RESET_PASS_INVALID;
    }

    const user = await this.authService.getUserByCode(code);

    if (!user) {
      throw Causes.CODE_RESET_PASS_INVALID;
    }

    await this.authService.updateResetPassword(user, password);

    return true;
  }

  @Put('/update-profile/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ['admin'],
    operationId: 'update profile admin',
    summary: 'update profile admin',
    description: 'update profile admin',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: RegisterBase,
  })
  async updateProfile(
    @Param('id') id: number,
    @Body() data: UpdateProfile,
    @Req() request: RequestWithUser
  ): Promise<any | EmptyObject> {
    if (!request || !request.user) throw Causes.USER_DONT_HAVE_PERMISSION;

    if (request.user.type !== 1 && request.user.id !== id) {
      throw Causes.USER_DONT_HAVE_PERMISSION;
    }

    const userUpdated = await this.authService.updateProfile(id, data);

    return userUpdated;
  }
}
