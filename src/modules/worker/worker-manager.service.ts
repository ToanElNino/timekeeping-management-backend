import {Config, User} from '../../database/entities';
import {LatestBlock} from '../../database/entities';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {CurrencyConfig} from '../../database/entities';
import {getLogger} from '../../shared/logger';
import {Repository} from 'typeorm';
import {NotificationService} from '../notification/notification.service';
import {SocketService} from './socket.service';
import {S3Handler} from '../../shared/S3Handler';
import {KmsService} from '../common/kms.service';
import {SocketNotificationService} from '../socket-notification/socket-notification.service';

const logger = getLogger('WorkerManagerService');
const cron = require('node-cron');

@Injectable()
export class WorkerManagerService {
  private _collectionMapping = {};

  constructor(
    private readonly kmsService: KmsService,
    private readonly notificationService: NotificationService,
    private readonly socketService: SocketService,
    private readonly socketNotificationService: SocketNotificationService,
    @InjectRepository(CurrencyConfig)
    private currenciesRepository: Repository<CurrencyConfig>,

    @InjectRepository(LatestBlock)
    private readonly latestBlockRepository: Repository<LatestBlock>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Config)
    private readonly configRepository: Repository<Config>,

    private readonly s3handler: S3Handler
  ) {
    this.init();
    cron.schedule('* * * * *', async () => {});
  }

  async init() {
    const currencies = await this.currenciesRepository.find();

    for (const currency of currencies) {
      if (currency.tokenAddresses) {
      }
    }

    this.runWorker(async () => {});
  }

  runWorker(_cb: () => void) {
    try {
      _cb();
    } catch (error) {
      logger.error(error);
    }
  }
}
