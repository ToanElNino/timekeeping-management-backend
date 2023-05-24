require('dotenv').config();
import {Module} from '@nestjs/common';
import * as Redis from 'redis';

import {REDIS} from './redis.constants';

@Module({
  providers: [
    {
      provide: REDIS,
      useValue: Redis.createClient({
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
        db: parseInt(process.env.REDIS_DB_CACHE),
        // password: process.env.REDIS_PASS
      }),
    },
  ],
  exports: [REDIS],
})
export class RedisModule {}
