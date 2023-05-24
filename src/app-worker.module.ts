import {CacheModule, Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Connection} from 'typeorm';
import {databaseConfig} from './config/database.config';
import {CommonModule} from './modules/common/common.module';
import {WorkerModule} from './modules/worker/worker.module';
import {ClientOpts} from 'redis';
import {redisConfig} from './config/redis.config';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRoot(databaseConfig),
    CacheModule.register<ClientOpts>(redisConfig),
    CommonModule,
    WorkerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppWorkerModule {
  constructor(private connection: Connection) {}
}
