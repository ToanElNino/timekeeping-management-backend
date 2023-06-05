/* eslint-disable node/no-extraneous-require */
import {DataSource, DataSourceOptions} from 'typeorm';
import {
  Admin,
  ApiKey,
  User,
  Event,
  Chain,
  Account,
  Tenant,
  CheckinLog,
  TimeSheet,
  Request,
  Schedule,
} from '../database/entities';
require('dotenv').config();

export const databaseConfig: DataSourceOptions = {
  type: (process.env.TYPEORM_CONNECTION || 'mysql') as any,
  host: process.env.TYPEORM_HOST || 'localhost',
  port: parseInt(process.env.TYPEORM_PORT) || 3306,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  entities: [
    User,
    Admin,
    ApiKey,
    Event,
    Chain,
    Tenant,
    Account,
    CheckinLog,
    TimeSheet,
    Request,
    Schedule,
  ],
  synchronize: process.env.NODE_ENV === 'dev-api123432',
  migrations: ['src/database/migrations/*.ts'],
};
const dataSource = new DataSource(databaseConfig);
export default dataSource;
