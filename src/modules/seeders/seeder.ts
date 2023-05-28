import {Injectable, Logger} from '@nestjs/common';
import {adminDataSeeds} from './data/admin';
import {kmsCmkDataSeeds} from './kms/data';
import {SeedService} from './seed.service';
import pwGenerator from 'generate-password';
import {IAdmin} from '../../database/interfaces/IAdmin.interface';
import {accountDataSeeds} from './data/account';
import {Account} from 'src/database/entities';

@Injectable()
export class Seeder {
  constructor(
    private readonly logger: Logger,
    private readonly seedService: SeedService
  ) {}

  async seed(entity: string) {
    try {
      if (entity === 'admin') {
        this.logger.debug('Start seeding admin!');
        await this.admin();
      } else if (entity === 'account') {
        await this.account();
      } else if (process.env.ENTITY === 'kms-cmk') {
        this.logger.debug('Start seeding kms-cmk!');
      } else if (process.env.ENTITY === 'all') {
        this.logger.debug('Start seeding all seeders!');
        try {
          await this.admin();
        } catch (error) {
          this.logger.error('Failed seeding admin with error: ', error.message);
        }

        // eslint-disable-next-line no-empty
        try {
        } catch (error) {
          this.logger.error(
            'Failed seeding kms-cmk with error: ',
            error.message
          );
        }
      } else {
        throw Error('Cannot find any entities!!!');
      }
    } catch (error) {
      this.logger.error('Failed seeding with error: ', error.message);
    }
  }

  async account() {
    for (let i = 0; i < accountDataSeeds.length; i++) {
      // const password = pwGenerator.generate({
      //   length: 10,
      //   numbers: true,
      //   uppercase: true,
      //   lowercase: true,
      // });
      const account: Partial<Account> = {
        ...accountDataSeeds[i],
      };
      await this.seedService.createOneAccount(account);
      this.logger.debug(
        `Seeding account ${account.username} with password: ${account.password}`
      );
      // return true;
    }
    return true;
  }
  async admin() {
    for (let i = 0; i < adminDataSeeds.length; i++) {
      // const password = pwGenerator.generate({
      //   length: 10,
      //   numbers: true,
      //   uppercase: true,
      //   lowercase: true,
      // });
      const password = '123qwe';
      const superAdmin: IAdmin = {
        ...adminDataSeeds[i],
        password,
      };
      if (adminDataSeeds[i].password) {
        await this.seedService.createOne(adminDataSeeds[i]);
        this.logger.debug(
          `Seeding admin ${superAdmin.username} with password: ${adminDataSeeds[i].password}`
        );
      } else {
        await this.seedService.createOne(superAdmin);
        this.logger.debug(
          `Seeding admin ${superAdmin.username} with password: ${password}`
        );
      }
      return true;
    }
  }
}
