import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {nowInMillis} from '../../shared/Utils';

@Entity('account')
@Index('tenant_id', ['tenantId'], {unique: false})
export class Account {
  @PrimaryGeneratedColumn({name: 'id', type: 'int'})
  id: number;

  @Column({
    name: 'tenant_id',
    type: 'int',
    unique: false,
    nullable: false,
  })
  public tenantId: number;

  @Column({
    name: 'username',
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true,
  })
  public username: string;

  @Column({name: 'password', type: 'varchar', length: 256, nullable: false})
  public password: string;
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
