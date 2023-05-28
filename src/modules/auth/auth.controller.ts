import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {ApiOperation, ApiResponse} from '@nestjs/swagger';
import * as argon2 from 'argon2';
import {Causes} from '../../config/exception/causes';
import {EmptyObject} from '../../shared/response/emptyObject.dto';
import {EmptyObjectBase} from '../../shared/response/emptyObjectBase.dto';
import {AuthService} from './auth.service';
import {JwtAuthGuard} from './jwt-auth.guard';
import {AuthToken} from './request/auth-token.dto';
import {LoginBody} from './request/login.dto';
import {AdminLoginResponse} from './response/login.dto';
import {User} from 'src/database/entities';
import {CreateAccountBody} from './request/create-account.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @ApiOperation({
    tags: ['auth'],
    operationId: 'login',
    summary: 'Login',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  async login(@Body() data: LoginBody): Promise<EmptyObject> {
    const user = await this.authService.validateUserFromLoginBody(data);
    // console.log('user: ', user);
    if (!user) {
      throw Causes.NON_RECORDED_USERNAME;
    }
    if (user.status !== 'ACTIVE') {
      throw Causes.ADMIN_IS_NOT_ACTIVE;
    }
    return this.authService.login(user);

    // if (await argon2.verify(user.password, data.password)) {
    //   return this.authService.login(user);
    // } else {
    //   throw Causes.PASSWORD_IS_FALSE;
    // }
  }

  @Post('/admin/create-account')
  @ApiOperation({
    tags: ['auth'],
    operationId: 'create account',
    summary: 'create account',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  async createAccount(@Body() data: CreateAccountBody): Promise<EmptyObject> {
    const res = await this.authService.createAccount(data);
    return res;
  }

  @Post('/logout')
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ['auth'],
    operationId: 'logout',
    summary: 'Logout',
    description: 'Logout',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: EmptyObjectBase,
  })
  async logout(@Req() request: any): Promise<EmptyObject> {
    const token = request.headers.authorization;
    await this.authService.logout(token);
    return new EmptyObject();
  }

  @Post('/refresh-token')
  @ApiOperation({
    tags: ['auth'],
    operationId: 'Refresh token',
    summary: 'Get token',
    description: 'Get token by fresh token',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: AdminLoginResponse,
  })
  async getTokenByFreshToken(
    @Body() data: AuthToken,
    @Req() request
  ): Promise<AdminLoginResponse | EmptyObject> {
    if (!data || !data.refreshToken) throw Causes.DATA_INVALID;

    const tokens = await this.authService.getTokenByFreshToken(
      data.refreshToken
    );
    request.session[process.env.KEY_ACCESS_SET_COOKIE] = tokens.access_token;
    request.session[process.env.KEY_REFRESH_SET_COOKIE] = tokens.refresh_token;
    return tokens;
  }
}
