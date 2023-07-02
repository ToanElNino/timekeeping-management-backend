import {Column, Entity, Index, PrimaryGeneratedColumn} from 'typeorm';

@Entity('department')
@Index('tenant_id', ['tenantId'], {unique: false})
export class Department {
  @PrimaryGeneratedColumn({name: 'id', type: 'int'})
  id: number;

  @Column({
    name: 'tenant_id',
    type: 'int',
  })
  public tenantId: number;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 50,
  })
  public name: string;

  @Column({
    name: 'address',
    type: 'varchar',
    length: 50,
  })
  public address: string;
  @Column({
    name: 'description',
    type: 'varchar',
    nullable: true,
  })
  public description: string;

  @Column({name: 'created_at', type: 'bigint', nullable: true})
  public createdAt: number;

  @Column({name: 'updated_at', type: 'bigint', nullable: true})
  public updatedAt: number;
}
