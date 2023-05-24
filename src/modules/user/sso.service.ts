import {Causes} from '../../config/exception/causes';
import {Wallet} from './request/wallet.dto';
import {Register} from './request/register.dto';
import {FolderImageS3, UserStatus} from '../../shared/enums';
import {getConnection, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from '../../database/entities/User.entity';
import {LoginResponse} from './response/login.dto';
import {HttpException, Injectable} from '@nestjs/common';
import axios from 'axios';
import {TwoFactorAuthenticationService} from './twoFactorAuthentication.service';
import {S3Handler} from '../../shared/S3Handler';
import {Admin} from '../../database/entities';

const LOGIN_BY_WALLET = '/auth/login-by-wallet';
const LOGIN_BY_EMAIL = '/auth/login';
const SSO_CONFIG = {
  client_id: process.env.CLIENT_ID_SSO,
  client_secret: process.env.CLIENT_SECRET_SSO,
};
const cacheConfig = new Map();

@Injectable()
export class SingleSignOnService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
    private readonly s3handler: S3Handler
  ) {}

  // async updateProfile(user: User, data: any, files: any, token: string) {
  //   const dataUser = user;
  //   if (!user || !user.username) return false;

  //   if (data) {
  //     for (const [key, value] of Object.entries(data)) {
  //       if (['bio', 'username'].includes(key)) {
  //         dataUser[key] = value;
  //       }
  //     }
  //   } else {
  //     dataUser.bio = null;
  //   }
  //   if (files) {
  //     if (files.avatar) {
  //       if (dataUser.avatarUrl) {
  //         const avatarStringArray = dataUser.avatarUrl.split('/');
  //         const oldImgName = avatarStringArray[avatarStringArray.length - 1];
  //         await this.s3handler.delete(FolderImageS3.USERS, oldImgName);
  //       }
  //       const avatarUpload = await this.s3handler.upload(
  //         FolderImageS3.USERS,
  //         files.avatar
  //       );

  //       if (!avatarUpload || !avatarUpload.Location) return false;
  //       dataUser.avatarUrl = avatarUpload.Location;
  //     }

  //     if (files.background) {
  //       if (dataUser.backgroundUrl) {
  //         const backgroundStringArray = dataUser.backgroundUrl.split('/');
  //         const oldImgName =
  //           backgroundStringArray[backgroundStringArray.length - 1];
  //         await this.s3handler.delete(FolderImageS3.USERS, oldImgName);
  //       }
  //       const backgroundUpload = await this.s3handler.upload(
  //         FolderImageS3.USERS,
  //         files.background
  //       );

  //       if (!backgroundUpload || !backgroundUpload.Location) return false;
  //       dataUser.backgroundUrl = backgroundUpload.Location;
  //     }
  //   }

  //   const avatar = dataUser.avatarUrl ? {avatar_url: dataUser.avatarUrl} : {};
  //   const background = dataUser.backgroundUrl
  //     ? {background_url: dataUser.backgroundUrl}
  //     : {};

  //   return await axios
  //     .post(
  //       process.env.ENDPOINT_API_SSO + '/users/update-profile',
  //       {
  //         username: dataUser.username,
  //         ...SSO_CONFIG,
  //         ...avatar,
  //         ...background,
  //       },
  //       {
  //         headers: {Authorization: token},
  //       }
  //     )
  //     .then(async response => {
  //       return await getConnection().transaction(async manager => {
  //         const dataResponse = response.data.data;
  //         return await manager
  //           .createQueryBuilder()
  //           .update(User)
  //           .set({
  //             username: dataResponse.username,
  //             avatarUrl: dataResponse.avatar_url,
  //             backgroundUrl: dataResponse.background_url,
  //             bio: dataUser.bio,
  //           })
  //           .where('email = :email', {email: dataResponse.email})
  //           .execute();
  //       });
  //     })
  //     .catch(error => {
  //       this.throwErrorSSO(error);
  //     });
  // }

  // async updatePassword(data: any, token: string, user) {
  //   return await axios
  //     .post(
  //       process.env.ENDPOINT_API_SSO + '/auth/update-password',
  //       {
  //         new_password: data.newPassword,
  //         old_password: data.oldPassword,
  //         ...SSO_CONFIG,
  //       },
  //       {
  //         headers: {Authorization: token},
  //       }
  //     )
  //     .then(async response => {
  //       const {password, twoFactorAuthenticationSecret, ...dataReturn} = user;
  //       return dataReturn;
  //     })
  //     .catch(error => {
  //       this.throwErrorSSO(error);
  //     });
  // }

  // async login(data: any): Promise<LoginResponse> {
  //   return this.loginBySSO(data, LOGIN_BY_EMAIL);
  // }

  // async refreshUserInfo(tokenOrId: string, isUseId = false) {
  //   let url = process.env.ENDPOINT_API_SSO + '/users/userinfo';
  //   if (isUseId) {
  //     url = url + '/' + tokenOrId;

  //     await axios
  //       .post(url, {
  //         client_id: process.env.CLIENT_ID_SSO,
  //         client_secret: process.env.CLIENT_SECRET_SSO,
  //       })
  //       .then(async response => {
  //         return this.createUser(response);
  //       })
  //       .catch(error => {
  //         this.throwErrorSSO(error);
  //       });
  //   } else {
  //     await axios
  //       .get(url, {
  //         headers: {Authorization: tokenOrId},
  //       })
  //       .then(async response => {
  //         return this.createUser(response);
  //       })
  //       .catch(error => {
  //         this.throwErrorSSO(error);
  //       });
  //   }
  // }

  // async createUser(response) {
  //   return await getConnection().transaction(async manager => {
  //     const user = new User();
  //     const dataResponse = response.data.data;
  //     user.id = null;
  //     user.username = dataResponse.username;
  //     user.email = dataResponse.email;
  //     user.polkaId = dataResponse.id;
  //     user.wallet = dataResponse.wallet;
  //     user.status = dataResponse.is_activated
  //       ? UserStatus.ACTIVE
  //       : UserStatus.REQUEST;
  //     user.avatarUrl = dataResponse.avatar_url;
  //     user.backgroundUrl = dataResponse.background_url;
  //     user.firstName = dataResponse.first_name;
  //     user.lastName = dataResponse.last_name;
  //     user.type = 'shared-user';
  //     await manager
  //       .createQueryBuilder()
  //       .insert()
  //       .into(User)
  //       .values(user)
  //       .orUpdate(
  //         [
  //           'username',
  //           'polka_id',
  //           'wallet',
  //           'status',
  //           'avatar_url',
  //           'background_url',
  //           'first_name',
  //           'last_name',
  //         ],
  //         ['email']
  //       )
  //       .execute();
  //   });
  // }

  // async getPublicKey(client_id: string, client_secret: string) {
  //   return axios
  //     .post(process.env.ENDPOINT_API_SSO + '/auth/public-key', {
  //       client_id,
  //       client_secret,
  //     })
  //     .then(async response => {
  //       return response.data.data.public_key;
  //     })
  //     .catch(error => {
  //       this.throwErrorSSO(error);
  //     });
  // }

  // async logout(token: string) {
  //   const tokenWithoutBearer = token.split(' ')[1];
  //   await axios
  //     .post(
  //       process.env.ENDPOINT_API_SSO + '/auth/logout',
  //       {},
  //       {headers: {Authorization: token}}
  //     )
  //     .then(async response => {
  //       await this.authService.deleteValidToken(tokenWithoutBearer);
  //     })
  //     .catch(error => {
  //       this.throwErrorSSO(error);
  //     });

  //   return {};
  // }

  // async loginByWallet(data: any): Promise<LoginResponse> {
  //   return this.loginBySSO(data, LOGIN_BY_WALLET);
  // }

  // async registerUser(data: Register): Promise<any> {
  //   let nonce;
  //   if (data.wallet) {
  //     nonce = await this.authService.getNonce(data.wallet);
  //   }

  //   if (!data.username) {
  //     data.username = data.email;
  //   }

  //   return axios
  //     .post(process.env.ENDPOINT_API_SSO + '/auth/register', {
  //       ...data,
  //       ...SSO_CONFIG,
  //       nonce,
  //     })
  //     .then(async response => {
  //       const user = new User();
  //       const dataResponse = response.data.data;
  //       user.username = dataResponse.username;
  //       user.email = dataResponse.email;
  //       user.polkaId = dataResponse.id;
  //       user.wallet = dataResponse.wallet;

  //       await this.createUser(response);
  //       return user;
  //     })
  //     .catch(error => {
  //       this.throwErrorSSO(error);
  //     });
  // }

  // async addWallet(data: Wallet, token: string, user): Promise<any> {
  //   if (!data || !data.wallet || !data.signature) throw Causes.DATA_INVALID;
  //   const nonce = await this.authService.getNonce(data.wallet);

  //   await axios
  //     .post(
  //       process.env.ENDPOINT_API_SSO + '/auth/add-wallet',
  //       {...data, nonce},
  //       {
  //         headers: {Authorization: token},
  //       }
  //     )
  //     .then(async response => {
  //       await getConnection().transaction(async transactional => {
  //         user.wallet = data.wallet;
  //         user = await transactional.save(user);
  //       });
  //     })
  //     .catch(error => {
  //       this.throwErrorSSO(error);
  //     });
  //   const {password, twoFactorAuthenticationSecret, ...dataUser} = user;

  //   return dataUser;
  // }

  // async createClient(
  //   client_id: string,
  //   client_secret: string,
  //   admin_token: string,
  //   admin: Admin
  // ): Promise<any> {
  //   await axios
  //     .post(
  //       process.env.ENDPOINT_API_SSO + '/auth/create-client',
  //       {
  //         client_id,
  //         client_secret,
  //       },
  //       {
  //         headers: {Authorization: admin_token},
  //       }
  //     )
  //     .then(async res => {
  //       // res.data.client.id
  //       admin.clientId = res.data.client.id;
  //       await getConnection().transaction(async manager => {
  //         await manager
  //           .createQueryBuilder(Admin, 'admin')
  //           .update(admin)
  //           .where('id = :id', {id: admin.id})
  //           .execute();
  //       });
  //     })
  //     .catch(error => {
  //       this.throwErrorSSO(error);
  //     });
  // }

  // async getClientById(id: number, admin_token: string): Promise<any> {
  //   let client = {};
  //   await axios
  //     .post(
  //       process.env.ENDPOINT_API_SSO + `/auth/client/${id}`,
  //       {},
  //       {
  //         headers: {Authorization: admin_token},
  //       }
  //     )
  //     .then(res => {
  //       client = res.data.client;
  //     })
  //     .catch(error => {
  //       this.throwErrorSSO(error);
  //     });
  //   return client;
  // }

  // async updateStatusClient(
  //   id: number,
  //   is_disabled: number,
  //   admin_token: string
  // ): Promise<any> {
  //   await axios
  //     .post(
  //       process.env.ENDPOINT_API_SSO + '/auth/update-status-client',
  //       {
  //         id,
  //         is_disabled,
  //       },
  //       {
  //         headers: {Authorization: admin_token},
  //       }
  //     )
  //     .then(() => {
  //       return true;
  //     })
  //     .catch(error => {
  //       this.throwErrorSSO(error);
  //     });
  // }

  // async updateSecretClient(
  //   id: number,
  //   client_secret_new: string,
  //   admin_token: string
  // ): Promise<any> {
  //   await axios
  //     .post(
  //       process.env.ENDPOINT_API_SSO + '/auth/update-secret-client',
  //       {
  //         id,
  //         client_secret_new,
  //       },
  //       {
  //         headers: {Authorization: admin_token},
  //       }
  //     )
  //     .then(() => {
  //       return true;
  //     })
  //     .catch(error => {
  //       this.throwErrorSSO(error);
  //     });
  // }

  // async sendMailResetPassword(email: string): Promise<any> {
  //   await axios
  //     .post(process.env.ENDPOINT_API_SSO + '/auth/send-mail-reset-password', {
  //       email,
  //       ...SSO_CONFIG,
  //     })
  //     .then(async response => {
  //       return response;
  //     })
  //     .catch(error => {
  //       this.throwErrorSSO(error);
  //     });
  // }

  // async resendMailActiveUser(email: string): Promise<any> {
  //   await axios
  //     .post(process.env.ENDPOINT_API_SSO + '/auth/resend-mail-active-user', {
  //       email,
  //       ...SSO_CONFIG,
  //     })
  //     .then(async response => {
  //       return response;
  //     })
  //     .catch(error => {
  //       this.throwErrorSSO(error);
  //     });
  // }

  // async resetPassword(code: string, password: string): Promise<any> {
  //   await axios
  //     .post(process.env.ENDPOINT_API_SSO + '/auth/reset-password', {
  //       code,
  //       password,
  //       ...SSO_CONFIG,
  //     })
  //     .then(async response => {
  //       return response;
  //     })
  //     .catch(error => {
  //       this.throwErrorSSO(error);
  //     });
  // }

  // async deleteInvalidUser(id: number, admin_token: string): Promise<any> {
  //   await axios
  //     .delete(process.env.ENDPOINT_API_SSO + `/auth/delete/${id}`, {
  //       headers: {Authorization: admin_token},
  //     })
  //     .then(() => {
  //       return true;
  //     })
  //     .catch(error => {
  //       this.throwErrorSSO(error);
  //     });
  // }

  // async getTokenByFreshToken(refreshToken: string): Promise<LoginResponse> {
  //   if (!refreshToken) throw Causes.DATA_INVALID;
  //   return await axios
  //     .post(process.env.ENDPOINT_API_SSO + '/auth/token', {
  //       ...SSO_CONFIG,
  //       refresh_token: refreshToken,
  //     })
  //     .then(async response => {
  //       return response.data.data;
  //     })
  //     .catch(error => {
  //       this.throwErrorSSO(error);
  //     });
  // }

  // async checkValidUserByWalletSSO(data: any): Promise<LoginResponse> {
  //   if (!data || !data.wallet || !data.signature) throw Causes.DATA_INVALID;

  //   await this.authService.checkValidWallet(data);

  //   const user = await this.authService.getUserByWallet(data.wallet);

  //   if (!user) throw Causes.USER_ERROR;

  //   return await this.loginBySSO(data, LOGIN_BY_WALLET);
  // }

  // async checkValidUserByEmailSSO(data: any): Promise<LoginResponse> {
  //   const user = await this.authService.getUserByData(data);

  //   if (!user) throw Causes.USER_ERROR;

  //   return await this.loginBySSO(data, LOGIN_BY_EMAIL);
  // }

  // async loginBySSO(data: any, url: string): Promise<any> {
  //   const nonce = await this.authService.getNonce(data.wallet);
  //   const request = {
  //     ...data,
  //     ...SSO_CONFIG,
  //     nonce,
  //   };

  //   if (url == LOGIN_BY_EMAIL) {
  //     request.grant_type = 'password';
  //   }
  //   let response = null;
  //   try {
  //     response = await axios.post(process.env.ENDPOINT_API_SSO + url, request);
  //   } catch (error) {
  //     this.throwErrorSSO(error);
  //   }
  //   const result = response.data.data;

  //   await this.authService.setValidToken(result.access_token);

  //   const user = await this.authService.getUserByData(data);

  //   // if (!user) {
  //   await this.refreshUserInfo('Bearer ' + result.access_token);
  //   // }

  //   return result;
  // }

  // public throwErrorSSO(error) {
  //   throw new HttpException(
  //     {
  //       error: error.response.data.error,
  //       error_code: error.response.data.error_code,
  //       dynamic_data: error.response.data.dynamic_data,
  //     },
  //     error.response.status
  //   );
  // }
}
