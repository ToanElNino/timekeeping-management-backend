import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {Account, Tenant, User} from '../../database/entities';
import {IPaginationOptions} from 'nestjs-typeorm-paginate';
import {PaginationResponse} from '../../config/rest/paginationResponse';
import {
  getArrayPaginationBuildTotal,
  getOffset,
  nowInMillis,
} from '../../shared/Utils';
import {UserRepository} from './user.repository';
import {
  AdminCreateStaffRequest,
  StaffUpdateProfileRequest,
  UpdateProfileRequest,
} from './request/updateProfile';
import {S3Handler} from 'src/shared/S3Handler';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(
    private usersRepository: UserRepository,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    private readonly s3Handler: S3Handler
  ) {}

  async getListEndUser(
    params,
    paginationOptions: IPaginationOptions
  ): Promise<PaginationResponse<User>> {
    const offset = getOffset(paginationOptions);
    const limit = Number(paginationOptions.limit);

    const {data, countData} = await this.usersRepository.filterUser(
      offset,
      limit,
      params
    );

    const {items, meta} = getArrayPaginationBuildTotal<User>(
      data,
      countData,
      paginationOptions
    );

    return {
      results: items,
      pagination: meta,
    };
  }

  async staffGetProfile(userId: number, accountId: number, tenantId: number) {
    const userDB = await this.usersRepository.findOne({
      where: {
        id: userId,
        tenantId: tenantId,
        accountId: accountId,
      },
    });
    if (!userDB)
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
    const accountDB = await this.accountRepository.findOne({
      where: {
        id: accountId,
        tenantId: tenantId,
      },
    });
    if (!accountDB)
      throw new HttpException('Account does not exist', HttpStatus.BAD_REQUEST);
    delete accountDB.id;
    const tenantDB = await this.tenantRepository.findOne({
      where: {
        id: tenantId,
      },
    });
    if (!tenantDB)
      throw new HttpException('Tenant does not exist', HttpStatus.BAD_REQUEST);

    return {...accountDB, ...userDB, tenantName: tenantDB.name};
  }

  async adminCreateStaff(
    avatarFile: Express.Multer.File,
    body: AdminCreateStaffRequest,
    tenantId: number
  ) {
    const accountDB = await this.accountRepository.findOne({
      where: {
        username: body.username,
      },
    });
    if (accountDB)
      throw new HttpException('Duplicate username', HttpStatus.BAD_REQUEST);
    //create account

    const hashedPassword = await argon2.hash(body.password);
    if (!hashedPassword) {
      throw new HttpException(
        'Cannot hash password',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    const newAccount: Partial<Account> = {
      tenantId: tenantId,
      username: body.username,
      password: hashedPassword,
      status: 'ACTIVE',
      createdAt: nowInMillis(),
      updatedAt: nowInMillis(),
      roleId: body.roleId,
    };

    const newAccountDB = await this.accountRepository.save(newAccount);
    if (!newAccountDB)
      throw new HttpException(
        'Cannot create new account for staff',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    const newUser: Partial<User> = {
      tenantId: tenantId,
      checkInLogId: body.checkinLogId ?? null,
      accountId: newAccountDB.id,
      name: body.name,
      email: body.email,
      phoneNumber: body.phoneNumber,
      avatarUrl: null,
      status: 'ACTIVE',
      homeAddress: body.homeAddress,
      departmentId: body.departmentId,
      onboardAt: body.onboardAt,
      createdAt: nowInMillis(),
      updatedAt: nowInMillis(),
    };

    if (avatarFile) {
      const s3Response = await this.s3Handler.upload('hrm', avatarFile);
      console.log('s3Response: ', s3Response);
      if (s3Response?.Location) newUser.avatarUrl = s3Response?.Location;
      if (avatarFile && !s3Response?.Location) {
        throw new HttpException(
          'Image icon upload error',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
    const res = await this.usersRepository.save(newUser);
    return res;
  }

  async adminUpdateStaffProfile(
    avatarFile: Express.Multer.File,
    body: UpdateProfileRequest
  ) {
    const userDB = await this.usersRepository.findOne({
      where: {
        id: body.userId,
      },
    });
    if (!userDB)
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
    //if wanted to update avatar
    if (avatarFile) {
      const s3Response = await this.s3Handler.upload('hrm', avatarFile);
      console.log('s3Response: ', s3Response);
      if (s3Response?.Location) userDB.avatarUrl = s3Response?.Location;
      if (avatarFile && !s3Response?.Location) {
        throw new HttpException(
          'Image icon upload error',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
    userDB.checkInLogId = body.checkinLogId;
    userDB.name = body.name;
    userDB.email = body.email;
    userDB.departmentId = body.departmentId;
    userDB.phoneNumber = body.phoneNumber;
    userDB.homeAddress = body.homeAddress;
    userDB.onboardAt = body.onboardAt;
    userDB.updatedAt = nowInMillis();
    const res = await this.usersRepository.save(userDB);
    return res;
  }

  async staffUpdateProfile(body: StaffUpdateProfileRequest, userId: number) {
    const userDB = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!userDB)
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
    //if wanted to update avatar
    userDB.name = body.name;
    userDB.email = body.email;
    userDB.phoneNumber = body.phoneNumber;
    userDB.homeAddress = body.homeAddress;
    userDB.updatedAt = nowInMillis();
    const res = await this.usersRepository.save(userDB);
    return res;
  }

  async staffUpdateAvatar(avatarFile: Express.Multer.File, userId: number) {
    const userDB = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!userDB)
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
    //if wanted to update avatar
    const s3Response = await this.s3Handler.upload('hrm', avatarFile);
    if (s3Response?.Location) userDB.avatarUrl = s3Response?.Location;
    if (avatarFile && !s3Response?.Location) {
      throw new HttpException(
        'Image icon upload error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    userDB.updatedAt = nowInMillis();
    const res = await this.usersRepository.save(userDB);
    return res;
  }
}
