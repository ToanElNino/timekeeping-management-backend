import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Account, Admin, Tenant, User} from 'src/database/entities';
import {CreateAccountBody} from './request/create-account.dto';
import * as argon2 from 'argon2';
import {nowInMillis} from 'src/shared/Utils';

@Injectable()
export class AuthRepository extends Repository<Admin> {
  constructor(
    @InjectRepository(Admin)
    repository: Repository<Admin>,
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
  async validateTenantCode(tenantCode: string) {
    const tenantDb = await this.tenantRepository.findOne({
      where: {code: tenantCode},
    });
    // console.log(tenantDb);
    if (!tenantDb)
      throw new HttpException('Not found company code', HttpStatus.BAD_REQUEST);
    return tenantDb;
  }
  async checkDuplicateAccount(username: string, tenantId: number){
    const accountDB = await this.accountRepository.findOne({
      where: {username: username, tenantId: tenantId},
    });
    // console.log(tenantDb);
    if (accountDB)
      throw new HttpException('Duplicate user', HttpStatus.BAD_REQUEST);
  }

  async validateTenantId(tenantId: number) {
    const tenantDb = await this.tenantRepository.findOne({
      where: {id: tenantId},
    });
    // console.log(tenantDb);
    if (!tenantDb)
      throw new HttpException('Not found tenant id', HttpStatus.BAD_REQUEST);
    return tenantDb;
  }

  async validateAccount(tenantId: number, username: string): Promise<any> {
    const account = await this.accountRepository.findOne({
      where: {
        tenantId: tenantId,
        username: username,
      },
    });
    // console.log(account);
    if (!account)
      throw new HttpException('Not found account', HttpStatus.BAD_REQUEST);
    return account;
  }

  async createNewAccount(
    data: CreateAccountBody,
    tenantId: number
  ): Promise<any> {
    const hashedPassword = await argon2.hash(data.password);
    let newAccount: Partial<Account> = {
      id: null,
      tenantId: tenantId,
      username: data.username,
      password: hashedPassword,
      status: 'ACTIVE',
      createdAt: nowInMillis(),
      updatedAt: nowInMillis(),
    };
    newAccount = await this.accountRepository.save(newAccount);
    if (!newAccount)
      throw new HttpException(
        'Cannot create new account',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    // console.log(account);
    return newAccount;
  }

  async createNewUser(tenantId: number, accountId: number): Promise<any> {
    let newUser: Partial<User> = {
      tenantId: tenantId,
      accountId: accountId,
      status: 'ACTIVE',
      createdAt: nowInMillis(),
      updatedAt: nowInMillis(),
    };
    newUser = await this.userRepository.save(newUser);
    if (!newUser)
      throw new HttpException(
        'Cannot create new user',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    // console.log(account);
    return newUser;
  }

  async validateUser(tenantId: number, accountId: number): Promise<any> {
    console.log('accountId: ', accountId);
    console.log('tenantId: ', tenantId);
    const user = await this.userRepository.findOne({
      where: {
        tenantId: tenantId,
        accountId: accountId,
      },
    });
    // console.log('user: ', user);
    if (!user)
      throw new HttpException('Not found user', HttpStatus.BAD_REQUEST);
    return user;
  }

  async getUserByUsername(username: string): Promise<Admin | undefined> {
    return this.findOne({where: {username: username}});
  }

  async getUserById(id: number): Promise<Admin | undefined> {
    return this.findOne({where: {id: id}});
  }

  async updateCode(user: Admin, code: string) {
    user.code = code;
    user = await this.save(user);

    delete user.code;
    delete user.password;

    return user;
  }

  async updateAdmin(user: Admin) {
    return await this.save(user);
  }

  async updateStatus(status: string, user: Admin) {
    user.status = status;
    user = await this.save(user);
    return user;
  }

  async deleteAdminById(id: number) {
    const user = await this.findOne({where: {id: id}});
    if (user) {
      return this.createQueryBuilder('admin')
        .select('admin.id')
        .where('admin.id = :id', {id: id})
        .delete()
        .execute();
    } else {
      return false;
    }
  }

  async updateProfileAdmin(user: Admin) {
    let userAdmin = await this.findOne({where: {id: user.id}});

    userAdmin.fullName = user.fullName;
    userAdmin.type = user.type;
    userAdmin.status = user.status;
    userAdmin = await this.save(userAdmin);
    return userAdmin;
  }
  async getUserByEmail(email: string): Promise<Admin | undefined> {
    return this.findOne({where: {email: email}});
  }

  async getUserByCode(code: string): Promise<Admin | undefined> {
    return this.findOne({where: {code: code}});
  }
}
