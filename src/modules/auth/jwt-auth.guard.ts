/* eslint-disable node/no-extraneous-require */
import {ExecutionContext, Injectable} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {AuthService} from './auth.service';
import {JwtService} from '@nestjs/jwt';
import {Causes} from '../../config/exception/causes';

const jwt = require('jsonwebtoken');

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    try {
      const req = context.switchToHttp().getRequest();
      const headers = req.headers;
      const token = headers.authorization ? headers.authorization : '';
      if (!token) {
        throw Causes.JWT_MISSING;
      }

      const user = this.jwtService.decode(token.split(' ')[1]);
      if (!user || !(user['username'] || user['email']))
        throw Causes.USER_ERROR;
      jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);

      // const userDB = await this.authService.getUserByEmailAndUsername(
      //   user['email'],
      //   user['username']
      // );
      // if (!userDB) throw Causes.USER_ERROR;

      // // const p = await this.authService.isValidToken(`${user['userId']}`, token.split(' ')[1]);
      // req.user = userDB;

      // return p;
      return true;
    } catch (error) {
      // console.log('error: ', error);
      if (error.message === 'jwt expired') {
        throw Causes.JWT_EXPIRED;
      }
      if (error.message === 'jwt token missing from header') {
        throw Causes.JWT_MISSING;
      }
      return false;
    }
  }
}
