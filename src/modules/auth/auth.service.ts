/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import * as argon2 from 'argon2';
import {Cache} from 'cache-manager';
import {IPaginationOptions} from 'nestjs-typeorm-paginate';
import {Causes} from '../../config/exception/causes';
import {PaginationResponse} from '../../config/rest/paginationResponse';
import {Account, Admin, Tenant, User} from '../../database/entities';
import {IAdmin} from '../../database/interfaces/IAdmin.interface';
import {encrypt} from '../../shared/Utils';
import {CreateAdmin} from './request/create.dto';
import {CreatePartnership} from './request/createPartnership.dto';
import {PagingFilterDataAdmin, Sort} from './request/pagingFilterDataAdmin.dto';
import {UpdateProfile} from './request/update-profile.dto';
import {AuthRepository} from './auth.repository';
import {LoginBody} from './request/login.dto';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Role} from 'src/shared/enums';
import {ROLE_ID_NAME} from 'src/shared/enums';
import {CreateAccountBody} from './request/create-account.dto';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,

    private authRepository: AuthRepository,
    // @InjectRepository(Account)
    // private accountRepository: Repository<Account>,
    // @Inject(CACHE_MANAGER) private cacheManager: Cache
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) {}

  async createOne(admin: IAdmin): Promise<any> {
    const hashedPassword = await argon2.hash(admin.password);

    admin = {...admin, password: hashedPassword};
    return this.authRepository.save(admin);
  }

  async getListAdmin(): Promise<any> {
    const data = await this.authRepository.find();

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
      return this.authRepository.getUserByUsername(username);
    }
    if (email) {
      return this.authRepository.getUserByEmail(email);
    }
    return null;
  }
  async validateTenantCode(tenantCode: string) {
    const tenantDb = await this.authRepository.validateTenantCode(tenantCode);
    if (!tenantDb)
      throw new HttpException('Invalid company code', HttpStatus.BAD_REQUEST);
    return tenantDb;
  }

  async validateUserFromLoginBody(data: LoginBody): Promise<any> {
    const {username, companyCode} = data;
    const tenant = await this.authRepository.validateTenantCode(companyCode);
    const account: Account = await this.authRepository.validateAccount(
      tenant.id,
      username
    );
    const user = await this.authRepository.validateUser(tenant.id, account.id);
    // console.log(user);
    return {
      ...user,
      password: account.password,
      roleId: account.roleId,
      tenantCode: tenant.code,
      tenantIcon: tenant.iconUrl,
      tenantName: tenant.name,
    };
  }

  async createAccount(data: CreateAccountBody): Promise<any> {
    const tenant = await this.authRepository.validateTenantId(data.tenantId);
    await this.authRepository.checkDuplicateAccount(data.username, tenant.id);

    const newAccount = await this.authRepository.createNewAccount(
      data,
      tenant.id
    );
    // console.log(newAccount);
    const newUser = await this.authRepository.createNewUser(
      tenant.id,
      newAccount.id
    );
    // console.log(user);
    return {...newUser};
  }
  async validateAdminActive(email: any) {
    const admin = await this.authRepository.getUserByEmail(email);

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
    const roleName = ROLE_ID_NAME[user.roleId];
    // console.log('roleName: ', roleName);
    if (!roleName)
      throw new HttpException(
        'Invalid role for account',
        HttpStatus.BAD_REQUEST
      );
    // console.log(user);
    const payload = {
      userId: user.id,
      username: user.username,
      tenantId: user.tenantId,
      tenantCode: user.tenantCode,
      tenantIcon: user.tenantIcon,
      tenantName: user.tenantName,
      accountId: user.accountId,
      check_in_log_id: user.checkInLogId,
      role: roleName,
      roleId: user.roleId,
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
      userId: user.id,
      username: user.username,
      tenantId: user.tenantId,
      tenantCode: user.tenantCode,
      tenantIcon: user.tenantIcon,
      tenantName: user.tenantName,
      accountId: user.accountId,
      check_in_log_id: user.checkInLogId,
      role: roleName,
      roleId: user.roleId,
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
      if (!user) throw Causes.USER_ERROR;
      // console.log(user);
      const tenant = await this.authRepository.validateTenantId(user.tenantId);
      const account: Account = await this.authRepository.validateAccount(
        tenant.id,
        user.username
      );
      const userDB = await this.authRepository.validateUser(
        tenant.id,
        account.id
      );
      if (!userDB) throw Causes.USER_ERROR;
      const status = await this.isValidToken(`${userDB.id}`, refreshToken);
      if (!status) throw Causes.JWT_EXPIRED;
      return this.login({
        ...userDB,
        password: account.password,
        roleId: account.roleId,
        tenantCode: tenant.code,
        tenantIcon: tenant.iconUrl,
        tenantName: tenant.name,
      });
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
  // async checkDuplicatedUser(data: CreateAccountBody): Promise<any> {
  //   //check duplicated username or email
  //   const duplicatedUser = await this.getUserByUsernameAndTenantId(
  //     data.email,
  //     data.username
  //   );
  //   return duplicatedUser;
  // }

  async checkPermissionUser(user: any): Promise<any> {
    const userData = await this.authRepository.findOne(user.id);
    // check is super admin or not
    if (userData.type === 1) {
      return true;
    }
    return false;
  }

  async isAdmin(user: any): Promise<any> {
    const userData = await this.authRepository.findOne(user.id);
    // check is super admin or not
    if (userData.type === 1) {
      return true;
    }
    return false;
  }

  async isPartnerShip(user: any): Promise<any> {
    const userData = await this.authRepository.findOne(user.id);
    // console.log('userData: ', userData)
    // check is partnership or not
    if (userData.type === 2) {
      return true;
    }
    return false;
  }

  async isActive(user: any): Promise<any> {
    const userData = await this.authRepository.findOne({
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
      (await this.authRepository.findOne({where: {username: username}})) ||
      (await this.authRepository.findOne({where: {email: email}}))
    );
  }

  async health(token: string, user: Admin) {
    if (!user || !user.username || !token) return false;

    const dataUser = await this.authRepository.getUserByUsername(user.username);
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
  async extractFieldsFromToken(request: any) {
    const token = request.headers.authorization;
    if (!token) {
      throw Causes.JWT_MISSING;
    }
    const user = this.jwtService.decode(token.split(' ')[1]);
    if (!user || !(user['username'] || user['tenantId']))
      throw Causes.USER_ERROR;
    // console.log('user: ', user);
    // console.log('tenantId: ', user['tenantId']);
    return {
      tenantId: user['tenantId'],
      accountId: user['accountId'],
      userId: user['userId'],
      role: user['role'],
      roleId: user['roleId'],
    };
  }
}
