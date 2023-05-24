import {Injectable, Logger} from '@nestjs/common';
import {adminDataSeeds} from './admin/data';
import {kmsCmkDataSeeds} from './kms/data';
import {SeedService} from './seed.service';
import pwGenerator from 'generate-password';
import {IAdmin} from '../../database/interfaces/IAdmin.interface';

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
      } else if (process.env.ENTITY === 'kms-cmk') {
        this.logger.debug('Start seeding kms-cmk!');
        await this.kmsCmk();
      } else if (process.env.ENTITY === 'all') {
        this.logger.debug('Start seeding all seeders!');
        try {
          await this.admin();
        } catch (error) {
          this.logger.error('Failed seeding admin with error: ', error.message);
        }

        try {
          await this.kmsCmk();
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

  async admin() {
    for (let i = 0; i < adminDataSeeds.length; i++) {
      const password = pwGenerator.generate({
        length: 10,
        numbers: true,
        uppercase: true,
        lowercase: true,
      });
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

  async kmsCmk() {
    await this.seedService.createKmsCmks(kmsCmkDataSeeds);
    return true;
  }
}
