import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {IPaginationOptions} from 'nestjs-typeorm-paginate';
import {PaginationResponse} from '../../config/rest/paginationResponse';
import {Department} from '../../database/entities';
import {
  getArrayPaginationBuildTotal,
  getOffset,
  nowInMillis,
} from '../../shared/Utils';
import {Repository, getConnection} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {CreateDepartmentRequest} from './request/createDepartment';
import {UpdateDepartmentRequest} from './request/updateDepartment';
import {DeleteDepartmentRequest} from './request/deleteDepartment';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private departmentRepo: Repository<Department>
  ) {}
  async getListCheckDepartmentForTenant(
    paginationOptions: IPaginationOptions,
    params: any
  ) {
    const limit = Number(paginationOptions.limit);
    const offset = getOffset(paginationOptions);
    console.log(limit);
    console.log(offset);

    const queryBuilder = this.departmentRepo
      .createQueryBuilder('department')
      .orderBy('department.created_at', 'DESC')
      .limit(limit)
      .offset(offset);
    const queryCount = this.departmentRepo
      .createQueryBuilder('department')
      .select(' Count (1) as Total')
      .orderBy('department.created_at', 'DESC');
    //filter for topic and title by keyword params
    //tenant
    queryBuilder.andWhere('department.tenant_id =:tenantId', {
      tenantId: params.tenantId,
    });
    queryCount.andWhere('department.tenant_id =:tenantId', {
      tenantId: params.tenantId,
    });

    const data = await queryBuilder.getMany();
    const countData = await queryCount.execute();
    console.log(data);
    console.log(countData);
    const {items, meta} = getArrayPaginationBuildTotal<Department>(
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

  async createDepartment(data: CreateDepartmentRequest) {
    const Department: Department = {
      createdAt: nowInMillis(),
      updatedAt: nowInMillis(),
      id: null,
      name: data.name,
      tenantId: data.tenantId,
      address: data.address,
      description: data.description,
    };
    const newDepartment = await this.departmentRepo.save(Department);
    if (!newDepartment) {
      throw new HttpException(
        'Cannot create new Department',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    return newDepartment;
  }
  async getATenantDepartment(tenantId: number) {
    const department = await this.departmentRepo.findOne({
      where: {
        tenantId: tenantId,
      },
    });
    if (!department) return new Department();
    return department;
  }
  async updateDepartment(data: UpdateDepartmentRequest) {
    const departmentDB = await this.departmentRepo.findOne({
      where: {id: data.id},
    });
    if (!departmentDB) {
      throw new HttpException('Invalid department id', HttpStatus.BAD_REQUEST);
    }

    departmentDB.name = data.name;
    departmentDB.address = data.address;
    departmentDB.description = data.description;

    const updateDepartment = await this.departmentRepo.save(departmentDB);
    if (!updateDepartment) {
      throw new HttpException(
        'Cannot update department',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    return updateDepartment;
  }
  async deleteDepartment(data: DeleteDepartmentRequest) {
    const departmentDB = await this.departmentRepo.findOne({
      where: {id: data.id},
    });
    if (!departmentDB) {
      throw new HttpException('Invalid department id', HttpStatus.BAD_REQUEST);
    }

    const deleteDepartment = await this.departmentRepo.delete(departmentDB);
    if (!deleteDepartment) {
      throw new HttpException(
        'Cannot delete department',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    return deleteDepartment;
  }
}
