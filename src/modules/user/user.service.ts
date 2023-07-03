import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {User} from '../../database/entities';
import {IPaginationOptions} from 'nestjs-typeorm-paginate';
import {PaginationResponse} from '../../config/rest/paginationResponse';
import {
  getArrayPaginationBuildTotal,
  getOffset,
  nowInMillis,
} from '../../shared/Utils';
import {UserRepository} from './user.repository';
import {
  StaffUpdateProfileRequest,
  UpdateProfileRequest,
} from './request/updateProfile';
import {S3Handler} from 'src/shared/S3Handler';
@Injectable()
export class UserService {
  constructor(
    private usersRepository: UserRepository,
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
