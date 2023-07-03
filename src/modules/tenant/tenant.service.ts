import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateTenantBody} from './request/create-tenant';
import {Repository} from 'typeorm';
import {Tenant} from 'src/database/entities';
import {InjectRepository} from '@nestjs/typeorm';
import {
  getArrayPaginationBuildTotal,
  getOffset,
  nowInMillis,
} from 'src/shared/Utils';
import {IPaginationOptions} from 'nestjs-typeorm-paginate';
import {UpdateStatusTenantBody} from './request/update-status';
import {S3Handler} from 'src/shared/S3Handler';
import {AdminUpdateTenantBody, UpdateTenantBody} from './request/update-tenant';
@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
    private readonly s3Handler: S3Handler
  ) {}

  async createNewTenant(body: CreateTenantBody, iconFile: Express.Multer.File) {
    const tenantDB = await this.tenantRepository.findOne({
      where: {code: body.code},
    });
    console.log(body);
    console.log(iconFile);
    console.log(tenantDB);
    if (tenantDB) {
      throw new HttpException('Duplicate tenant code', HttpStatus.BAD_REQUEST);
    }

    const newTenant: Partial<Tenant> = {
      name: body.name,
      code: body.code,
      createdAt: nowInMillis(),
    };
    if (iconFile) {
      const s3Response = await this.s3Handler.upload('hrm', iconFile);
      if (s3Response?.Location) newTenant.iconUrl = s3Response?.Location;
      console.log(s3Response);
      if (iconFile && !s3Response?.Location) {
        throw new HttpException(
          'Image icon upload error',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
    const res = await this.tenantRepository.save(newTenant);
    if (!res) {
      throw new HttpException(
        'Cannot create tenant',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    return res;
  }

  async updateTenant(body: UpdateTenantBody, iconFile: Express.Multer.File) {
    const tenantDB = await this.tenantRepository.findOne({
      where: {id: body.id},
    });
    if (!tenantDB) {
      throw new HttpException('Not fount tenant', HttpStatus.BAD_REQUEST);
    }
    if (iconFile) {
      const s3Response = await this.s3Handler.upload('hrm', iconFile);
      if (s3Response?.Location) tenantDB.iconUrl = s3Response?.Location;
      if (iconFile && !s3Response?.Location) {
        throw new HttpException(
          'Image icon upload error',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
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

  async adminUpdateTenant(
    body: AdminUpdateTenantBody,
    iconFile: Express.Multer.File,
    tenantId: number
  ) {
    const tenantDB = await this.tenantRepository.findOne({
      where: {id: tenantId},
    });
    if (!tenantDB) {
      throw new HttpException('Not fount tenant', HttpStatus.BAD_REQUEST);
    }
    if (iconFile) {
      const s3Response = await this.s3Handler.upload('hrm', iconFile);
      if (s3Response?.Location) tenantDB.iconUrl = s3Response?.Location;
      if (iconFile && !s3Response?.Location) {
        throw new HttpException(
          'Image icon upload error',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
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

  async updateStatus(id: number, body: UpdateStatusTenantBody) {
    if (body.status !== 'ACTIVE' && body.status !== 'INACTIVE') {
      throw new HttpException('Invalid status', HttpStatus.BAD_REQUEST);
    }
    const tenantDB = await this.tenantRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!tenantDB)
      throw new HttpException(
        'Tenant id does not exist',
        HttpStatus.BAD_REQUEST
      );
    if (tenantDB.status === body.status) {
      throw new HttpException('Same old status', HttpStatus.BAD_REQUEST);
    }
    tenantDB.status = body.status;
    tenantDB.updatedAt = nowInMillis();
    const res = await this.tenantRepository.save(tenantDB);
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
