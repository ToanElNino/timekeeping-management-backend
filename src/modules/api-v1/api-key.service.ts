/* eslint-disable @typescript-eslint/no-unused-vars */
import {Injectable} from '@nestjs/common';
import * as argon2 from 'argon2';
import {getRepository} from 'typeorm';
import {ApiKey} from '../../database/entities';

@Injectable()
export class ApiKeyService {
  constructor() {}

  async isValidApiKey(apiKey: string) {
    if (apiKey.length <= 20) {
      return null;
    }
    const apiKeySecret = apiKey.substring(20);
    const clientIdentity = apiKey.substr(0, 20);
    const keyItem = await getRepository(ApiKey).findOne({
      where: {
        apiKey: clientIdentity,
      },
    });

    if (keyItem) {
      //verify hashed secret and plain-secret
      const verified = await argon2.verify(keyItem.apiSecret, apiKeySecret);
      return verified;
    }
    return null;
  }
}
