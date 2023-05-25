import {CACHE_MANAGER, Inject, Injectable} from '@nestjs/common';
import {UserService} from './user.service';
import {User} from '../../database/entities';
import {
  aesDecrypt,
  aesEncrypt,
  convertToString,
  encrypt,
  isJsonString,
} from '../../shared/Utils';
import {authenticator} from 'otplib';
import {Cache} from 'cache-manager';

@Injectable()
export class TwoFactorAuthenticationService {
  constructor(
    private readonly usersService: UserService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  // public async isTwoFactorAuthenticationCodeValid(
  //   twoFactorAuthenticationCode: string,
  //   user: User
  // ) {
  //   const email = user.email;
  //   const key = encrypt('2FA-' + email);
  //   const value = await this.cacheManager.get<any>(key);
  //   const data = value && isJsonString(value) ? JSON.parse(value) : {};

  //   if (
  //     data.total &&
  //     data.total >= (parseInt(process.env.LIMIT_REQUEST) || 5)
  //   ) {
  //     if (
  //       data.timeRequest &&
  //       Date.now() - data.timeRequest <
  //         (parseInt(process.env.LIMIT_HOURS_BLOCK_REQUEST) || 4) *
  //           60 *
  //           60 *
  //           1000
  //     )
  //       return false;

  //     data.total = 0;
  //     data.timeRequest = Date.now();
  //     await this.cacheManager.set(key, JSON.stringify(data), {ttl: 0});
  //   }

  //   const isCodeValid = authenticator.verify({
  //     token: twoFactorAuthenticationCode,
  //     secret: convertToString(
  //       aesDecrypt(user.twoFactorAuthenticationSecret, process.env.AES_KEY)
  //     ),
  //   });

  //   if (isCodeValid) {
  //     if (data.total) {
  //       await this.cacheManager.del(key);
  //     }
  //   } else {
  //     if (data.total) {
  //       data.total += 1;
  //     } else {
  //       data.total = 1;
  //     }
  //     data.timeRequest = Date.now();
  //     await this.cacheManager.set(key, JSON.stringify(data), {ttl: 0});
  //   }

  //   return isCodeValid;
  // }

  // public async generateTwoFactorAuthenticationSecret(user: User) {
  //   const secret = aesEncrypt(
  //     authenticator.generateSecret(),
  //     process.env.AES_KEY
  //   );
  //   await this.usersService.setTwoFactorAuthenticationSecret(secret, user.id);

  //   return secret;
  // }
}
