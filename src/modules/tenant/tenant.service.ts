import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateTenantBody} from './request/create-tenant';
import {Repository} from 'typeorm';
import {Tenant} from 'src/database/entities';
import {InjectRepository} from '@nestjs/typeorm';
@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>
  ) {}

  async createNewTenant(body: CreateTenantBody) {
    const tenantDB = await this.tenantRepository.findOne({
      where: {code: body.code},
    });
    if (tenantDB) {
      throw new HttpException('Duplicate tenant code', HttpStatus.BAD_REQUEST);
    }
    const newTenant: Partial<Tenant> = {
      name: body.name,
      code: body.code,
    };
    const res = await this.tenantRepository.save(newTenant);
    if (!res) {
      throw new HttpException(
        'Cannot create tenant',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    return res;
  }
}
