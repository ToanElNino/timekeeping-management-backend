import {Injectable, CanActivate, ExecutionContext} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {Role} from 'src/shared/enums';
import {ROLES_KEY} from './roles.decorator';
import {JwtService} from '@nestjs/jwt';
import {Causes} from 'src/config/exception/causes';
import {AuthService} from './auth.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private authService: AuthService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const req = context.switchToHttp().getRequest();
    const headers = req.headers;
    const token = headers.authorization ? headers.authorization : '';
    if (!token) {
      throw Causes.JWT_MISSING;
    }
    const user = this.jwtService.decode(token.split(' ')[1]);
    if (!user || !(user['username'] || user['tenantId']))
      throw Causes.USER_ERROR;
    console.log('user: ', user);

    // const userDB = await this.authService.getAccount(
    //   user['email'],
    //   user['tenantId']
    // );
    // console.log('userDB: ', userDB);
    // if (!userDB) throw Causes.USER_ERROR;
    console.log('role form token: ', user['role']);
    console.log('role from guard: ', requiredRoles);

    const check = requiredRoles.some(role => user['role'].includes(role));
    console.log('check: ', check);
    return check;
  }
}
