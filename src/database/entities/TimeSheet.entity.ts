import {Column, Entity, Index, PrimaryColumn} from 'typeorm';

@Entity('time_sheet')
@Index('tenant_id', ['tenantId'], {unique: false})
@Index('month_record', ['monthRecord'], {unique: false})
@Index('user_id', ['userId'], {unique: false})
@Index('day_record', ['dayRecord'], {unique: false})
export class TimeSheet {
  @PrimaryColumn({name: 'id', type: 'varchar', unique: true, length: 256})
  id: string;

  @Column({
    name: 'tenant_id',
    type: 'int',
    unique: false,
  })
  public tenantId: number;

  @Column({
    name: 'user_id',
    type: 'int',
    unique: false,
    nullable: false,
  })
  public userId: number;

  @Column({name: 'day_record', type: 'varchar', nullable: false, length: 10})
  public dayRecord: string;

  @Column({name: 'month_record', type: 'varchar', nullable: false, length: 7})
  public monthRecord: string;

  @Column({
    name: 'is_calculated',
    type: 'tinyint',
    default: 0,
  })
  public isCalculated: number;

  @Column({
    name: 'status',
    type: 'varchar',
    nullable: false,
    length: 10,
    default: 'NEW',
  })
  public status: number;

  @Column({
    name: 'come_late_minutes',
    type: 'int',
    nullable: false,
    default: -1,
  })
  public comeLateMinutes: number;

  @Column({
    name: 'leave_early_minutes',
    type: 'int',
    nullable: false,
    default: -1,
  })
  public leaveEarlyMinutes: number;

  @Column({
    name: 'working_day',
    type: 'int',
    nullable: false,
    default: 0,
  })
  public workingDay: number;

  @Column({
    name: 'working_hours',
    type: 'int',
    nullable: false,
    default: 0,
  })
  public workingHours: number;

  @Column({name: 'time_record_number', type: 'bigint', nullable: false})
  public timeRecordNumber: number;

  @Column({name: 'created_at', type: 'bigint', nullable: true})
  public createdAt: number;

  @Column({name: 'updated_at', type: 'bigint', nullable: true})
  public updatedAt: number;
}
