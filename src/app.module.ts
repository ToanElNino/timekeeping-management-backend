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
import {TransformInterceptor} from './config/rest/transform.interceptor';
import {APP_FILTER, APP_GUARD, APP_INTERCEPTOR} from '@nestjs/core';
import {ExceptionFilter} from './config/exception/exception.filter';
import {redisConfig} from './config/redis.config';
import {AuthModule} from './modules/auth/auth.module';
import {EventModule} from './modules/event/event.module';
import {AdminService} from './modules/admin/admin.service';
import {JwtService} from '@nestjs/jwt';
import {AuthService} from './modules/auth/auth.service';
import {ChainModule} from './modules/chain/chain.module';
import {FileStorageModule} from './modules/file-storage/file-storage.module';
import {RolesGuard} from './modules/auth/roles.guard';
import {TenantModule} from './modules/tenant/tenant.module';
import {CheckinLogModule} from './modules/checkin-log/checkinLog.module';
import {TimeSheetModule} from './modules/time-sheet/TimeSheet.modules';
import {ScheduleModule} from './modules/schedule/schedule.module';
import {TimeSheetWorkerModule} from './modules/timesheet-worker/timesheet-worker.module';
import {DepartmentModule} from './modules/department/department.module';
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
    RedisModule,
    EventModule,
    ChainModule,
    FileStorageModule,
    TenantModule,
    CheckinLogModule,
    TimeSheetModule,
    ScheduleModule,
    TimeSheetWorkerModule,
    DepartmentModule,
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
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
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
