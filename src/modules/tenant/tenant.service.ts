import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateTenantBody} from './request/create-tenant';
import {Repository} from 'typeorm';
import {Tenant} from 'src/database/entities';
import {InjectRepository} from '@nestjs/typeorm';
import {getArrayPaginationBuildTotal, getOffset} from 'src/shared/Utils';
import {IPaginationOptions} from 'nestjs-typeorm-paginate';
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
    console.log(body);
    console.log(tenantDB);
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

  async updateTenant(body: CreateTenantBody) {
    const tenantDB = await this.tenantRepository.findOne({
      where: {code: body.code},
    });
    if (!tenantDB) {
      throw new HttpException('Not fount tenant', HttpStatus.BAD_REQUEST);
    }
    tenantDB.code = body.code;
    tenantDB.name = body.name;
    const res = await this.tenantRepository.save(tenantDB);
    if (!res) {
      throw new HttpException(
        'Cannot update tenant',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    return res;
  }

  async getListTenant(paginationOptions: IPaginationOptions, params: any) {
    const limit = Number(paginationOptions.limit);
    const offset = getOffset(paginationOptions);
    console.log(limit);
    console.log(offset);

    const queryBuilder = this.tenantRepository
      .createQueryBuilder('tenant')
      .orderBy('tenant.createdAt', 'DESC')
      .limit(limit)
      .offset(offset);
    const queryCount = this.tenantRepository
      .createQueryBuilder('tenant')
      .select(' Count (1) as Total')
      .orderBy('tenant.createdAt', 'DESC');
    //filter for topic and title by keyword params

    if (params.keyWord && params.keyWord !== '') {
      if (
        params.keyWord &&
        params.keyWord.includes('%') !== true &&
        params.keyWord.includes('_') !== true
      ) {
        queryBuilder.andWhere(
          `tenant.name like '%${params.keyWord.trim()}%' || tenant.code like '%${params.keyWord.trim()}%'`
        );
        queryCount.andWhere(
          `tenant.name like '%${params.keyWord.trim()}%' || tenant.code like '%${params.keyWord.trim()}%'`
        );
      } else {
        queryBuilder.andWhere(
          `tenant.name like '%!${params.keyWord.trim()}%' ESCAPE '!' || tenant.code like '%!${params.keyWord.trim()}%' ESCAPE '!'`
        );
        queryCount.andWhere(
          `tenant.name like '%!${params.keyWord.trim()}%' ESCAPE '!' || tenant.code like '%!${params.keyWord.trim()}%' ESCAPE '!'`
        );
      }
    }

    const data = await queryBuilder.getMany();
    const countData = await queryCount.execute();
    const {items, meta} = getArrayPaginationBuildTotal<Tenant>(
      data,
      countData,
      {
        limit,
        offset,
      }
    );

    return {
      results: items,
      pagination: meta,
    };
  }
}
