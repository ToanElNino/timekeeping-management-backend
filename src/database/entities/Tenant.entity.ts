import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {nowInMillis} from '../../shared/Utils';

@Entity('tenant')
export class Tenant {
  @PrimaryGeneratedColumn({name: 'id', type: 'int'})
  id: number;

  @Column({
    name: 'code',
    type: 'varchar',
    length: 20,
    unique: false,
    nullable: false,
  })
  public code: string;

  @Column({name: 'name', type: 'varchar', length: 50})
  public name: string;

  @Column({
    name: 'status',
    type: 'varchar',
    length: 20,
    nullable: false,
    default: 'ACTIVE',
  })
  public status: string;

  @Column({name: 'created_at', type: 'bigint', nullable: true})
  public createdAt: number;

  @Column({name: 'updated_at', type: 'bigint', nullable: true})
  public updatedAt: number;

  @Column({
    name: 'role_id',
    type: 'tinyint',
    nullable: false,
    default: 1,
    width: 1,
  })
  public roleId: number;

  @BeforeInsert()
  public updateCreateDates() {
    this.createdAt = nowInMillis();
    this.updatedAt = nowInMillis();
  }

  @BeforeUpdate()
  public updateUpdateDates() {
    this.updatedAt = nowInMillis();
  }
}
