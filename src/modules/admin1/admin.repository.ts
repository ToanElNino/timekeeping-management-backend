import {Admin} from 'src/database/entities';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Injectable} from '@nestjs/common';

@Injectable()
export class AdminRepository extends Repository<Admin> {
  constructor(
    @InjectRepository(Admin)
    repository: Repository<Admin>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async _registerUser(
    email: string,
    fullName: string,
    username: string,
    password: string,
    type: number
  ) {
    let user = new Admin();
    user.email = email;
    user.fullName = fullName;
    user.password = password;
    user.username = username;
    user.type = type;
    user = await this.save(user);
    return user;
  }

  async getUserByEmail(email: string): Promise<Admin | undefined> {
    return this.findOne({where: {email: email}});
  }

  async getUserByCode(code: string): Promise<Admin | undefined> {
    return this.findOne({where: {code: code}});
  }

  async getUserByEmailAndUsername(
    email: string,
    username: string
  ): Promise<Admin | undefined> {
    return (
      (await this.findOne({where: {username: username}})) ||
      (await this.findOne({where: {email: email}}))
    );
  }
  async filterAdmin(offset: number, limit: number, params: any) {
    const queryBuilder = this.createQueryBuilder('admin')
      .select([
        'admin.id',
        'admin.username',
        'admin.email',
        'admin.status',
        'admin.avatarUrl',
        'admin.fullName',
        'admin.type',
        'admin.createdAt',
        'admin.updatedAt',
      ])
      .orderBy('admin.createdAt', 'DESC')
      .limit(limit)
      .offset(offset);
    const queryCount = this.createQueryBuilder('admin')
      .select(' Count (1) as Total')
      .orderBy('admin.createdAt', 'DESC');
    if (params.username && params.username !== '') {
      if (
        params.username &&
        params.username.includes('%') !== true &&
        params.username.includes('_') !== true
      ) {
        queryBuilder.andWhere(
          `admin.username like '%${params.username.trim()}%'`
        );
        queryCount.andWhere(
          `admin.username like '%${params.username.trim()}%'`
        );
      } else {
        queryBuilder.andWhere(
          `admin.username like '%!${params.username.trim()}%' ESCAPE '!'`
        );
        queryCount.andWhere(
          `admin.username like '%!${params.username.trim()}%' ESCAPE '!'`
        );
      }
    }
    if (params.status) {
      queryBuilder.andWhere('admin.status =:status', {
        status: params.status,
      });
      queryCount.andWhere('admin.status =:status', {
        status: params.status,
      });
    }
    if (params.email && params.email !== '') {
      if (
        params.email.includes('%') !== true &&
        params.email.includes('_') !== true
      ) {
        queryBuilder.andWhere(`admin.email like '%${params.email.trim()}%'`);
        queryCount.andWhere(`admin.email like '%${params.email.trim()}%'`);
      } else {
        queryBuilder.andWhere(
          `admin.email like '%!${params.email.trim()}%' ESCAPE '!'`
        );
        queryCount.andWhere(
          `admin.email like '%!${params.email.trim()}%' ESCAPE '!'`
        );
      }
    }
    if (params.type) {
      queryBuilder.andWhere('admin.type  =:type', {type: params.type});
      queryCount.andWhere('admin.type  =:type', {type: params.type});
    }
    const admins = await queryBuilder.getMany();
    const adminsCountList = await queryCount.execute();
    return {admins, adminsCountList};
  }

  async getUserById(id: number): Promise<Admin | undefined> {
    return this.findOne({where: {id: id}});
  }

  async getUserByUsername(username: string): Promise<Admin | undefined> {
    return this.findOne({where: {username: username}});
  }
  async getListAdmin(): Promise<any> {
    const data = await this.find();

    return data.map(e => {
      return {
        username: e.username,
        email: e.email,
        createdAt: e.createdAt,
        updatedAt: e.updatedAt,
      };
    });
  }
}
