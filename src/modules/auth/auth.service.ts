/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {CACHE_MANAGER, HttpException, Inject, Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import * as argon2 from 'argon2';
import {Cache} from 'cache-manager';
import {IPaginationOptions} from 'nestjs-typeorm-paginate';
import {Causes} from '../../config/exception/causes';
import {PaginationResponse} from '../../config/rest/paginationResponse';
import {Admin, User} from '../../database/entities';
import {IAdmin} from '../../database/interfaces/IAdmin.interface';
import {encrypt} from '../../shared/Utils';
import {CreateAdmin} from './request/create.dto';
import {CreatePartnership} from './request/createPartnership.dto';
import {PagingFilterDataAdmin, Sort} from './request/pagingFilterDataAdmin.dto';
import {UpdateProfile} from './request/update-profile.dto';
import {AuthRepository} from './auth.repository';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,

    private adminRepository: AuthRepository,

    // @Inject(CACHE_MANAGER) private cacheManager: Cache

    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) {}

  async createOne(admin: IAdmin): Promise<any> {
    const hashedPassword = await argon2.hash(admin.password);

    admin = {...admin, password: hashedPassword};
    return this.adminRepository.save(admin);
  }

  async getListAdmin(): Promise<any> {
    const data = await this.adminRepository.find();

    return data.map(e => {
      return {
        username: e.username,
        email: e.email,
        createdAt: e.createdAt,
        updatedAt: e.updatedAt,
      };
    });
  }

  //login
  async validateAdmin(data: any): Promise<any> {
    const {username, email} = data;
    if (username) {
      return this.adminRepository.getUserByUsername(username);
    }
    if (email) {
      return this.adminRepository.getUserByEmail(email);
    }
    return null;
  }

  async validateAdminActive(email: any) {
    const admin = await this.adminRepository.getUserByEmail(email);

    if (admin) {
      if (admin.status === 'ACTIVE') {
        return false;
      } else {
        return true;
      }
    }

    return false;
  }

  async isValidToken(userId: string, token: string) {
    const tokenT = await this.cacheManager.get(
      `${process.env.JWT_REFRESH_REDIS_ADMIN_KEY}_${userId}`
    );
    return tokenT === encrypt(token);
  }

  async setValidToken(userId: string, token: string) {
    await this.cacheManager.set(
      `${process.env.JWT_REFRESH_REDIS_ADMIN_KEY}_${userId}`,
      encrypt(token)
    );
  }

  async deleteValidToken(userId: string) {
    await this.cacheManager.del(
      `${process.env.JWT_REFRESH_REDIS_ADMIN_KEY}_${userId}`
    );
  }

  async login(user: any): Promise<any> {
    const payload = {
      username: user.username,
      email: user.email,
      userId: user.id,
      role: 'admin',
    };
    const access_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_ACCESS_EXPIRED,
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRED,
    });

    await this.setValidToken(`${payload.userId}`, refresh_token);

    return {
      email: user.email,
      username: user.username,
      role: 'admin',
      type: user.type,
      access_token,
      refresh_token,
    };
  }

  async getTokenByFreshToken(refreshToken: string): Promise<any> {
    try {
      if (!refreshToken) throw Causes.DATA_INVALID;
      const user = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_SECRET,
      });
      if (!user || !(user['username'] || user['email']))
        throw Causes.USER_ERROR;
      const userDB = await this.getUserByEmailAndUsername(
        user['email'],
        user['username']
      );
      if (!userDB) throw Causes.USER_ERROR;
      const status = await this.isValidToken(`${userDB.id}`, refreshToken);
      if (!status) throw Causes.JWT_EXPIRED;
      return this.login(userDB);
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

  //register
  async checkDuplicatedUser(data: CreatePartnership): Promise<any> {
    //check duplicated username or email
    const duplicatedUser = await this.getUserByEmailAndUsername(
      data.email,
      data.username
    );
    return duplicatedUser;
  }

  async checkPermissionUser(user: any): Promise<any> {
    const userData = await this.adminRepository.findOne(user.id);
    // check is super admin or not
    if (userData.type === 1) {
      return true;
    }
    return false;
  }

  async isAdmin(user: any): Promise<any> {
    const userData = await this.adminRepository.findOne(user.id);
    // check is super admin or not
    if (userData.type === 1) {
      return true;
    }
    return false;
  }

  async isPartnerShip(user: any): Promise<any> {
    const userData = await this.adminRepository.findOne(user.id);
    // console.log('userData: ', userData)
    // check is partnership or not
    if (userData.type === 2) {
      return true;
    }
    return false;
  }

  async isActive(user: any): Promise<any> {
    const userData = await this.adminRepository.findOne({
      where: {
        id: user.id,
        status: 'ACTIVE',
      },
    });
    // check is active or not
    if (userData) {
      return true;
    }
    return false;
  }

  async getUserByEmailAndUsername(
    email: string,
    username: string
  ): Promise<Admin | undefined> {
    return (
      (await this.adminRepository.findOne({where: {username: username}})) ||
      (await this.adminRepository.findOne({where: {email: email}}))
    );
  }

  async health(token: string, user: Admin) {
    if (!user || !user.username || !token) return false;

    const dataUser = await this.adminRepository.getUserByUsername(
      user.username
    );
    if (dataUser) {
      return true;
    } else {
      return false;
    }
  }

  async logout(token: string) {
    const refreshToken = token.split(' ')[1];
    if (!refreshToken) throw Causes.DATA_INVALID;
    const user = await this.jwtService.verifyAsync(refreshToken, {
      secret: process.env.JWT_SECRET,
    });

    await this.deleteValidToken(`${user['userId']}`);
  }

  async genCode() {
    const hashedSecret = await argon2.hash(Date.now().toString());
    const code = this.jwtService.sign(
      {data: hashedSecret},
      {
        expiresIn: process.env.JWT_EXPIRED,
        secret: process.env.JWT_SECRET,
      }
    );
    return code;
  }
}
