import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {IPaginationOptions} from 'nestjs-typeorm-paginate';
import {PaginationResponse} from '../../config/rest/paginationResponse';
import {Account, Admin} from '../../database/entities';
import {
  getArrayPaginationBuildTotal,
  getOffset,
  nowInMillis,
} from '../../shared/Utils';
import {Repository, getConnection} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {CreateAdminRequest} from './request/createAdmin';
import {AuthService} from '../auth/auth.service';
import {CreateAccountBody} from '../auth/request/create-account.dto';
import {ROLE_ID} from 'src/shared/enums';
import {
  AdminChangePasswordBody,
  UserChangePasswordBody,
} from './request/changePassword';
import * as argon2 from 'argon2';
// import {UpdateAdminRequest} from './request/updateAdmin';
// import {DeleteAdminRequest} from './request/deleteAdmin';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Account)
    private accountRepo: Repository<Account>,
    private readonly authService: AuthService
  ) {}
  async getListAdminAccount(
    paginationOptions: IPaginationOptions,
    params: any
  ) {
    const limit = Number(paginationOptions.limit);
    const offset = getOffset(paginationOptions);
    console.log(limit);
    console.log(offset);

    const queryBuilder = this.accountRepo
      .createQueryBuilder('account')
      .orderBy('account.created_at', 'DESC')
      .limit(limit)
      .offset(offset);
    const queryCount = this.accountRepo
      .createQueryBuilder('account')
      .select(' Count (1) as Total')
      .orderBy('account.created_at', 'DESC');
    //filter for topic and title by keyword params
    //tenant
    if (params.tenantId) {
      queryBuilder.andWhere('account.tenant_id =:tenantId', {
        tenantId: params.tenantId,
      });
      queryCount.andWhere('account.tenant_id =:tenantId', {
        tenantId: params.tenantId,
      });
    }
    if (params.roleId !== undefined && Number(params.roleId) > 1) {
      queryBuilder.andWhere('account.role_id =:roleId', {
        roleId: params.roleId,
      });
      queryCount.andWhere('account.role_id =:roleId', {
        roleId: params.roleId,
      });
    } else {
      queryBuilder.andWhere(
        '(account.role_id =:role2 OR account.role_id =:role3)',
        {
          role2: ROLE_ID.ADMIN,
          role3: ROLE_ID.SUPER_ADMIN,
        }
      );
      queryCount.andWhere(
        '(account.role_id =:role2 OR account.role_id =:role3)',
        {
          role2: ROLE_ID.ADMIN,
          role3: ROLE_ID.SUPER_ADMIN,
        }
      );
    }
    if (params.status) {
      queryBuilder.andWhere('account.status =:status', {
        status: params.status,
      });
      queryCount.andWhere('account.status =:status', {
        status: params.status,
      });
    }
    const data = await queryBuilder.getMany();
    const countData = await queryCount.execute();
    console.log(data);
    console.log(countData);
    const {items, meta} = getArrayPaginationBuildTotal<Account>(
      data,
      countData,
      {
        limit,
        offset,
      }
    );

    return {
      results: items,
      pagination: meta,
    };
  }
  async createAdmin(data: CreateAdminRequest) {
    const adminAccount: CreateAccountBody = {
      username: data.username,
      password: data.password,
      tenantId: data.tenantId,
      roleId: data.roleId,
    };
    const newAdmin = await this.authService.createAccount(adminAccount);
    if (!newAdmin) {
      throw new HttpException(
        'Cannot create new Admin',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    return newAdmin;
  }

  async adminChangePassword(data: AdminChangePasswordBody) {
    const accountDB = await this.accountRepo.findOne({
      where: {
        tenantId: data.tenantId,
        id: data.accountId,
      },
    });
    if (!accountDB) {
      throw new HttpException('Cannot find account', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await argon2.hash(data.newPassword);
    if (!hashedPassword) {
      throw new HttpException(
        'Cannot hash password',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    accountDB.password = hashedPassword;
    const updatedAccount = await this.accountRepo.save(accountDB);
    if (!updatedAccount) {
      throw new HttpException(
        'Cannot change password account',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    return {};
  }

  async userUpdateAccountPassword(
    data: UserChangePasswordBody,
    tenantId: number,
    accountId: number
  ) {
    const accountDB = await this.accountRepo.findOne({
      where: {
        tenantId: tenantId,
        id: accountId,
      },
    });
    if (!accountDB) {
      throw new HttpException('Cannot find account', HttpStatus.BAD_REQUEST);
    }
    if (!(await argon2.verify(accountDB.password, data.oldPassword))) {
      throw new HttpException('Wrong old password', HttpStatus.BAD_REQUEST);
    }
    const newHashedPassword = await argon2.hash(data.newPassword);
    if (!newHashedPassword) {
      throw new HttpException(
        'Cannot hash password',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    accountDB.password = newHashedPassword;
    const updatedAccount = await this.accountRepo.save(accountDB);
    if (!updatedAccount) {
      throw new HttpException(
        'Cannot change password account',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    return {};
  }
  // async getATenantAdmin(tenantId: number) {
  //   const Admin = await this.AdminRepo.findOne({
  //     where: {
  //       tenantId: tenantId,
  //     },
  //   });
  //   if (!Admin) return new Admin();
  //   return Admin;
  // }
  // async updateAdmin(data: UpdateAdminRequest) {
  //   const AdminDB = await this.AdminRepo.findOne({
  //     where: {id: data.id},
  //   });
  //   if (!AdminDB) {
  //     throw new HttpException('Invalid Admin id', HttpStatus.BAD_REQUEST);
  //   }

  //   AdminDB.name = data.name;
  //   AdminDB.address = data.address;
  //   AdminDB.description = data.description;

  //   const updateAdmin = await this.AdminRepo.save(AdminDB);
  //   if (!updateAdmin) {
  //     throw new HttpException(
  //       'Cannot update Admin',
  //       HttpStatus.INTERNAL_SERVER_ERROR
  //     );
  //   }
  //   return updateAdmin;
  // }
  // async deleteAdmin(data: DeleteAdminRequest) {
  //   const AdminDB = await this.AdminRepo.findOne({
  //     where: {id: data.id},
  //   });
  //   if (!AdminDB) {
  //     throw new HttpException('Invalid Admin id', HttpStatus.BAD_REQUEST);
  //   }

  //   const deleteAdmin = await this.AdminRepo.delete(AdminDB);
  //   if (!deleteAdmin) {
  //     throw new HttpException(
  //       'Cannot delete Admin',
  //       HttpStatus.INTERNAL_SERVER_ERROR
  //     );
  //   }
  //   return deleteAdmin;
  // }
}
