import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Admin} from 'src/database/entities';

@Injectable()
export class AuthRepository extends Repository<Admin> {
  constructor(
    @InjectRepository(Admin)
    repository: Repository<Admin>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
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
