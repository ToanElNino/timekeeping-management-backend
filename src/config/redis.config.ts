import {StoreConfig} from 'cache-manager';
import {CacheModuleOptions} from '@nestjs/common/cache/interfaces/cache-module.interface';
import * as redisStore from 'cache-manager-redis-store';

export const redisConfig: CacheModuleOptions<StoreConfig> = {
  store: redisStore,
  ttl: Number(process.env.JWT_REFRESH_EXPIRED) / 1000,
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  db: process.env.REDIS_DB_CACHE,
  // auth_pass: process.env.REDIS_PASS,
  isGlobal: true,
};
