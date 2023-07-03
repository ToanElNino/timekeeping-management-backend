import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {User} from 'src/database/entities';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(
    @InjectRepository(User)
    repository: Repository<User>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async filterUser(offset: number, limit: number, params: any) {
    const queryBuilder = this.createQueryBuilder('user')
      .orderBy('user.createdAt', 'DESC')
      .limit(limit)
      .offset(offset);
    const queryCount = this.createQueryBuilder('user')
      .select(' Count (1) as Total')
      .orderBy('user.createdAt', 'DESC');
    if (params.tenantId) {
      queryBuilder.andWhere('user.tenant_id =:tenantId', {
        tenantId: params.tenantId,
      });
      queryCount.andWhere('user.tenant_id =:tenantId', {
        tenantId: params.tenantId,
      });
    }
    if (params.departmentId !== undefined && Number(params.departmentId) > 1) {
      queryBuilder.andWhere('user.department_id =:departmentId', {
        departmentId: params.departmentId,
      });
      queryCount.andWhere('user.department_id =:departmentId', {
        departmentId: params.departmentId,
      });
    }
    if (params.keyWord && params.keyWord !== '') {
      if (
        params.keyWord.includes('%') !== true &&
        params.keyWord.includes('_') !== true
      ) {
        // `event.topic like '%${params.keyWord.trim()}%' || event.title like '%${params.keyWord.trim()}%'`

        queryBuilder.andWhere(
          `user.name like '%${params.keyWord.trim()}%' || user.email like '%${params.keyWord.trim()}%'`
        );
        queryCount.andWhere(
          `user.name like '%${params.keyWord.trim()}%' || user.email like '%${params.keyWord.trim()}%'`
        );
      } else {
        queryBuilder.andWhere(
          `user.name like '%!${params.keyWord.trim()}%' ESCAPE '!' || user.email like '%!${params.keyWord.trim()}%' ESCAPE '!'`
        );
        queryCount.andWhere(
          `user.name like '%!${params.keyWord.trim()}%' ESCAPE '!' || user.email like '%!${params.keyWord.trim()}%' ESCAPE '!'`
        );
      }
    }
    if (params.status) {
      queryBuilder.andWhere('user.status =:status', {
        status: params.status,
      });
      queryCount.andWhere('user.status =:status', {
        status: params.status,
      });
    }

    const data = await queryBuilder.getMany();
    const countData = await queryCount.execute();
    return {data, countData};
  }
}
