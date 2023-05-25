import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Account, Admin, CurrencyConfig} from '../../database/entities';
import {Repository} from 'typeorm';
import {IAdmin} from '../../database/interfaces/IAdmin.interface';
import * as argon2 from 'argon2';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>
  ) {}

  async createOne(admin: IAdmin): Promise<any> {
    const hashedPassword = await argon2.hash(admin.password);

    admin = {...admin, password: hashedPassword};
    return this.adminRepository.save(admin);
  }
  async createOneAccount(account: Partial<Account>): Promise<any> {
    const hashedPassword = await argon2.hash(account.password);
    account = {...account, password: hashedPassword};
    return this.accountRepository.save(account);
  }
}
