import {
  CacheModule,
  Inject,
  Logger,
  MiddlewareConsumer,
  Module,
} from '@nestjs/common';
import {RedisModule} from './modules/redis/redis.module';
import {REDIS} from './modules/redis/redis.constants';
import type {ClientOpts} from 'redis';
import {RedisClient} from 'redis';
import {ConfigModule} from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Connection} from 'typeorm';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {databaseConfig} from './config/database.config';
import {AdminModule} from './modules/admin/admin.module';
import {UserModule} from './modules/user/user.module';
import {CommonModule} from './modules/common/common.module';
import {TransformInterceptor} from './config/rest/transform.interceptor';
import {APP_FILTER, APP_INTERCEPTOR} from '@nestjs/core';
import {ExceptionFilter} from './config/exception/exception.filter';
import {NotificationModule} from './modules/notification/notification.module';
import {ApiV1Module} from './modules/api-v1/api-v1.module';
import {redisConfig} from './config/redis.config';
import {TokenModule} from './modules/token/token.module';
import {SocketNotificationModule} from './modules/socket-notification/socket-notification.module';
import {AuthModule} from './modules/auth/auth.module';
import {MerchantModule} from './modules/merchant/merchant.module';
import {EventModule} from './modules/event/event.module';
import {SystemWalletModule} from './modules/system-wallet/systemWallet.module';
import {TransactionSwapModule} from './modules/transaction-swap/transactionSwap.module';
import {ActivityModule} from './modules/activity/activity.module';
import {AdminService} from './modules/admin/admin.service';
import {JwtService} from '@nestjs/jwt';
import {AuthService} from './modules/auth/auth.service';
import {ChainModule} from './modules/chain/chain.module';
import {FileStorageModule} from './modules/file-storage/file-storage.module';
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRoot(databaseConfig),
    CacheModule.register(redisConfig),
    AdminModule,
    AuthModule,
    UserModule,
    CommonModule,
    NotificationModule,
    ApiV1Module,
    TokenModule,
    RedisModule,
    SocketNotificationModule,
    MerchantModule,
    EventModule,
    SystemWalletModule,
    TransactionSwapModule,
    ActivityModule,
    ChainModule,
    FileStorageModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AdminService,
    AuthService,
    JwtService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ExceptionFilter,
    },
    Logger,
  ],
})
export class AppModule {
  constructor(
    @Inject(REDIS) private readonly redis: RedisClient,
    private connection: Connection
  ) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        session({
          store: new RedisStore({client: this.redis, logErrors: true}),
          saveUninitialized: false,
          secret: process.env.SECRET_KEY,
          resave: false,
          rolling: true,
          proxy: true, // comment for localhost
          cookie: {
            maxAge: parseInt(process.env.EXPIRE_REFRESH_SET_COOKIE),
            sameSite: 'none', // comment for localhost
            secure: true, // comment for localhost
            httpOnly: true, // comment for localhost
            path: '/',
          },
        })
      )
      .forRoutes('*');
  }
}
