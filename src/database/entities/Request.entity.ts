import {Column, Entity, Index, PrimaryColumn} from 'typeorm';

@Entity('request')
@Index('tenant_id', ['tenantId'], {unique: false})
@Index('user_id', ['userId'], {unique: false})
export class Request {
  @PrimaryColumn({name: 'id', type: 'varchar', unique: true, length: 256})
  id: string;

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
    type: 'int',
    nullable: true,
  })
  public leaveType: number;

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

  @Column({name: 'ci_time', type: 'bigint', nullable: true})
  public ciTime: number;

  @Column({name: 'co_time', type: 'bigint', nullable: true})
  public coTime: number;

  @Column({
    name: 'cico_day',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  public CICODay: string;

  @Column({
    name: 'day_from',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  public dayFrom: string;

  @Column({
    name: 'day_to',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  public dayTo: string;

  @Column({name: 'created_at', type: 'bigint', nullable: true})
  public createdAt: number;

  @Column({name: 'updated_at', type: 'bigint', nullable: true})
  public updatedAt: number;
}
