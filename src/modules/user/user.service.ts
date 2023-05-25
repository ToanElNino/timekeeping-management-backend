import {Injectable} from '@nestjs/common';
import {User} from '../../database/entities';
import {IPaginationOptions} from 'nestjs-typeorm-paginate';
import {PaginationResponse} from '../../config/rest/paginationResponse';
import {getArrayPaginationBuildTotal, getOffset} from '../../shared/Utils';
import {UserRepository} from './user.repository';
@Injectable()
export class UserService {
  constructor(private usersRepository: UserRepository) {}

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

  // async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
  //   return this.usersRepository.update(userId, {
  //     twoFactorAuthenticationSecret: secret,
  //   });
  // }

  // async turnOnTwoFactorAuthentication(userId: number) {
  //   return this.usersRepository.update(userId, {
  //     isActive2fa: true,
  //   });
  // }

  // async turnOffTwoFactorAuthentication(userId: number) {
  //   return this.usersRepository.update(userId, {
  //     isActive2fa: false,
  //   });
  // }
}
