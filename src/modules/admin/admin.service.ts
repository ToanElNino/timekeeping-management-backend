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
import {getArrayPaginationBuildTotal, getOffset} from '../../shared/Utils';
import {CreatePartnership} from './request/createPartnership.dto';
import {UpdateProfile} from './request/update-profile.dto';
import {AdminRepository} from './admin.repository';

@Injectable()
export class AdminService {
  constructor(
    private jwtService: JwtService,
    private adminRepository: AdminRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) {}

  async createOne(admin: IAdmin): Promise<any> {
    const hashedPassword = await argon2.hash(admin.password);

    admin = {...admin, password: hashedPassword};
    return this.adminRepository.save(admin);
  }

  async getUserByCode(code: string) {
    return this.adminRepository.getUserByCode(code);
  }

  async getUserByEmail(email: string) {
    return this.adminRepository.getUserByEmail(email);
  }

  async getUserById(id: number) {
    return this.adminRepository.getUserById(id);
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
    const userData = await this.adminRepository.findOne({
      where: {
        id: user.id,
      },
    });
    // check is super admin or not
    if (userData.type === 1) {
      return true;
    }
    return false;
  }

  async isAdmin(user: any): Promise<any> {
    const userData = await this.adminRepository.findOne({
      where: {id: user.id},
    });
    // check is super admin or not
    if (userData.type === 1) {
      return true;
    }
    return false;
  }

  async isPartnerShip(user: any): Promise<any> {
    const userData = await this.adminRepository.findOne({
      where: {
        id: user.id,
      },
    });
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

  async getUserByEmailAndUsername(email: string, username: string) {
    return this.adminRepository.getUserByEmailAndUsername(email, username);
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

  async createPartnership(data: CreatePartnership): Promise<any> {
    const hashedPassword = await argon2.hash(data.password);

    const user = await this.adminRepository._registerUser(
      data.email,
      data.fullName,
      data.username,
      hashedPassword,
      data.type
    );
    return {
      id: user.id,
      email: user.email,
      username: user.username,
    };
  }

  async getToken(user: Admin) {
    const token = this.jwtService.sign({
      username: user.username,
      time: Date.now(),
    });

    user = await this.adminRepository.save(user);

    return token;
  }

  async getList(
    params,
    paginationOptions: IPaginationOptions
  ): Promise<PaginationResponse<Admin>> {
    const offset = getOffset(paginationOptions);
    const limit = Number(paginationOptions.limit);
    const {admins, adminsCountList} = await this.adminRepository.filterAdmin(
      offset,
      limit,
      params
    );
    const {items, meta} = getArrayPaginationBuildTotal<Admin>(
      admins,
      adminsCountList,
      paginationOptions
    );

    return {
      results: items,
      pagination: meta,
    };
  }

  async updatePassword(user: Admin, data: any) {
    if (!user || !user.username || !data) return false;

    let dataUser = await this.adminRepository.getUserByEmailAndUsername(
      user.email,
      user.username
    );
    if (!dataUser) return false;

    const isPassword = await argon2.verify(dataUser.password, data.oldPassword);

    if (!isPassword) return false;

    const hashedNewPassword = await argon2.hash(data.newPassword);

    dataUser.password = hashedNewPassword;
    dataUser = await this.adminRepository.save(dataUser);

    const {password, ...dataReturn} = dataUser;

    return dataReturn;
  }

  async updateProfile(id: number, data: UpdateProfile) {
    const admin = await this.adminRepository.findOne({where: {id: id}});
    if (!admin) return false;

    const checkDuplicate = await this.adminRepository.findOne({
      where: {
        username: data.username,
      },
    });
    if (checkDuplicate && checkDuplicate.id !== id) {
      throw Causes.DUPLICATED_USERNAME;
    }

    admin.fullName = data.fullName ? data.fullName : admin.fullName;
    admin.username = data.username ? data.username : admin.username;

    return await this.adminRepository.save(admin);
  }

  async updateResetPassword(user: Admin, password: string) {
    const hashedNewPassword = await argon2.hash(password);

    user.password = hashedNewPassword;
    user = await this.adminRepository.save(user);

    delete user.code;
    delete user.password;

    return user;
  }

  async updateCode(user: Admin, code: string) {
    user.code = code;
    user = await this.adminRepository.save(user);

    delete user.code;
    delete user.password;

    return user;
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

  async updateProfileFileAdmin(user: Admin, data: any) {
    //if (!user || !user.username || !data) return false;
    if (!user || !user.username) return false;
    let dataUser = await this.adminRepository.getUserByUsername(user.username);

    if (!dataUser) return false;
    if (data) {
      for (const [key, value] of Object.entries(data)) {
        if (['fullName', 'group', 'isActive'].includes(key)) {
          dataUser[key] = value;
        }
      }
    }

    dataUser = await this.adminRepository.save(dataUser);

    const {password, ...dataReturn} = dataUser;

    return dataReturn;
  }

  async updateProfileAdmin(user: Admin) {
    let userAdmin = await this.adminRepository.findOne({
      where: {
        id: user.id,
      },
    });

    userAdmin.fullName = user.fullName;
    userAdmin.type = user.type;
    userAdmin.status = user.status;
    userAdmin = await this.adminRepository.save(userAdmin);
    return userAdmin;
  }

  async updateAdmin(user: Admin) {
    return await this.adminRepository.save(user);
  }

  async updateStatus(status: string, user: Admin) {
    user.status = status;
    user = await this.adminRepository.save(user);
    return user;
  }

  async deleteAdminById(id: number) {
    const user = await this.adminRepository.findOne({where: {id: id}});
    if (user) {
      return this.adminRepository
        .createQueryBuilder('admin')
        .select('admin.id')
        .where('admin.id = :id', {id: id})
        .delete()
        .execute();
    } else {
      return false;
    }
  }
}
