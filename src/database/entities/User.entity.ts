/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {nowInMillis} from '../../shared/Utils';

@Entity('user')
@Index('tenant_id', ['tenantId'], {unique: false})
export class User {
  @PrimaryGeneratedColumn({name: 'id', type: 'int'})
  id: number;

  @Column({
    name: 'tenant_id',
    type: 'int',
  })
  public tenantId: number;

  @Column({
    name: 'account_name',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  public accountName: string;

  @Column({
    name: 'check_in_log_id',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  public checkInLogId: string;

  @Column({
    name: 'account_id',
    type: 'int',
    nullable: true,
  })
  public accountId: number;

  @Column({
    name: 'name',
    type: 'varchar',
    nullable: true,
    length: 50,
  })
  public name: string;

  @Column({
    name: 'email',
    type: 'varchar',
    nullable: true,
    length: 50,
  })
  public email: string;

  @Column({
    name: 'phone_number',
    type: 'varchar',
    nullable: true,
    length: 50,
  })
  public phoneNumber: string;

  @Column({
    name: 'avatar_url',
    type: 'varchar',
    nullable: true,
    length: 50,
  })
  public avatarUrl: string;

  @Column({
    name: 'status',
    type: 'varchar',
    length: 20,
    default: 'ACTIVE',
  })
  public status: string;

  @Column({
    name: 'home_address',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public homeAddress: string;

  @Column({
    name: 'department_id',
    type: 'int',
    nullable: true,
  })
  public departmentId: number;

  @Column({name: 'created_at', type: 'bigint', nullable: true})
  public createdAt: number;

  @Column({name: 'updated_at', type: 'bigint', nullable: true})
  public updatedAt: number;

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
