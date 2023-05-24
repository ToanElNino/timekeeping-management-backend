/* eslint-disable node/no-extraneous-require */
import {DataSource, DataSourceOptions} from 'typeorm';
import {
  Admin,
  ApiKey,
  Config,
  CurrencyConfig,
  Token,
  KmsCmk,
  KmsDataKey,
  LatestBlock,
  MailJob,
  MailLog,
  Notification,
  SocketNotification,
  SystemWallet,
  TransactionSwap,
  User,
  Transaction,
  TokenInterest,
  Event,
  Conversation,
  Message,
  UserDevice,
  PaymentRequest,
  Chain,
  TokenMultichain
} from '../database/entities';
import {Merchant} from '../database/entities/Merchant.entity';

require('dotenv').config();

export const databaseConfig: DataSourceOptions = {
  type: (process.env.TYPEORM_CONNECTION || 'mysql') as any,
  host: process.env.TYPEORM_HOST || 'localhost',
  port: parseInt(process.env.TYPEORM_PORT) || 3306,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  entities: [
    CurrencyConfig,
    KmsCmk,
    KmsDataKey,
    MailJob,
    MailLog,
    User,
    Admin,
    LatestBlock,
    Config,
    Notification,
    ApiKey,
    Token,
    SocketNotification,
    SystemWallet,
    TransactionSwap,
    Transaction,
    TokenInterest,
    Merchant,
    Event,
    Conversation,
    Message,
    PaymentRequest,
    UserDevice,
    Chain,
    TokenMultichain
  ],
  synchronize: process.env.NODE_ENV === 'dev-api',
  migrations: ['src/database/migrations/*.ts'],
};
const dataSource = new DataSource(databaseConfig);
export default dataSource;
