import {Column, Entity, Index, PrimaryGeneratedColumn} from 'typeorm';

@Entity('request')
@Index('tenant_id', ['tenantId'], {unique: false})
@Index('user_id', ['userId'], {unique: false})
export class Request {
  @PrimaryGeneratedColumn({name: 'id', type: 'int'})
  id: number;

  @Column({
    name: 'tenant_id',
    type: 'int',
  })
  public tenantId: number;

  @Column({
    name: 'user_id',
    type: 'int',
  })
  public userId: number;

  @Column({
    name: 'type',
    type: 'int',
  })
  public type: number;

  @Column({
    name: 'leave_type',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  public leaveType: string;

  @Column({
    name: 'reason',
    type: 'varchar',
    length: 256,
  })
  public reason: string;

  @Column({
    name: 'working_day',
    type: 'float',
    default: 0.0,
    nullable: true,
  })
  public workingDay: number;

  @Column({
    name: 'working_day_part',
    type: 'varchar',
    nullable: true,
  })
  public workingDayPart: string;

  @Column({
    name: 'resolved_by_user_id',
    type: 'int',
    nullable: true,
  })
  public resolveByUserId: number;

  @Column({
    name: 'status',
    type: 'varchar',
    length: 20,
    default: 'PENDING',
  })
  public status: string;

  @Column({
    name: 'reject_reason',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public rejectReason: string;

  @Column({name: 'change_ci_time', type: 'bigint', nullable: true})
  public changeCITime: number;

  @Column({name: 'change_ci_type', type: 'varchar', length: 20, nullable: true})
  public changeCIType: string;

  // @Column({
  //   name: 'cico_day',
  //   type: 'varchar',
  //   length: 10,
  //   nullable: true,
  // })
  // public CICODay: string;

  @Column({
    name: 'day_from',
    type: 'bigint',
    nullable: true,
  })
  public dayFrom: number;

  @Column({
    name: 'day_to',
    type: 'bigint',
    nullable: true,
  })
  public dayTo: number;

  @Column({name: 'created_at', type: 'bigint', nullable: true})
  public createdAt: number;

  @Column({name: 'updated_at', type: 'bigint', nullable: true})
  public updatedAt: number;
}
