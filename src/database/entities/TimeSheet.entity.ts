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
    name: 'time_come',
    type: 'bigint',
    nullable: true,
  })
  public timeCome: number;

  @Column({
    name: 'time_leave',
    type: 'bigint',
    nullable: true,
  })
  public timeLeave: number;

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
    name: 'working_day_1',
    type: 'float',
    nullable: false,
    default: -1,
  })
  public workingDay1: number;

  @Column({
    name: 'working_day_1_off',
    type: 'float',
    nullable: false,
    default: -1,
  })
  public workingDay1Off: number;

  @Column({
    name: 'working_day_2',
    type: 'float',
    nullable: false,
    default: -1,
  })
  public workingDay2: number;

  @Column({
    name: 'working_day_2_off',
    type: 'float',
    nullable: false,
    default: -1,
  })
  public workingDay2Off: number;

  @Column({
    name: 'working_hours',
    type: 'float',
    nullable: false,
    default: -1,
  })
  public workingHours: number;

  @Column({name: 'time_record_number', type: 'bigint', nullable: true})
  public timeRecordNumber: number;

  @Column({
    name: 'ot_time_come',
    type: 'bigint',
    nullable: true,
  })
  public otTimeCome: number;

  @Column({
    name: 'ot_time_leave',
    type: 'bigint',
    nullable: true,
  })
  public otTimeLeave: number;

  @Column({
    name: 'ot_working_day',
    type: 'float',
    nullable: false,
    default: -1,
  })
  public otWorkingDay: number;

  @Column({name: 'created_at', type: 'bigint', nullable: true})
  public createdAt: number;

  @Column({name: 'updated_at', type: 'bigint', nullable: true})
  public updatedAt: number;
}
