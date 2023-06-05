import { String } from 'aws-sdk/clients/acm';
import {Column, Entity, Index, PrimaryGeneratedColumn} from 'typeorm';

@Entity('schedule')
@Index('tenant_id', ['tenantId'], {unique: false})
export class Schedule {
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
    nullable: true,
  })
  public name: string;

  @Column({name: 'day_from', type: 'bigint', nullable: true})
  public dayFrom: number;

  @Column({name: 'day_to', type: 'bigint', nullable: true})
  public dayTo: number;

  @Column({name: 'time_start_1', type: 'varchar', length: 5})
  public timeStart1: string;

  @Column({name: 'time_end_1', type: 'varchar', length: 5})
  public timeEnd1: string;

  @Column({name: 'time_delay_1', type: 'varchar', length: 5})
  public timeDelay1: string;

  @Column({name: 'time_early_1', type: 'varchar', length: 5})
  public timeEarly1: string;

  @Column({name: 'time_come_off_1', type: 'varchar', length: 5})
  public timeComeOff1: string;

  @Column({name: 'time_leave_off_1', type: 'varchar', length: 5})
  public timeLeaveOff1: string;

  @Column({name: 'time_start_2', type: 'varchar', length: 5})
  public timeStart2: string;

  @Column({name: 'time_end_2', type: 'varchar', length: 5})
  public timeEnd2: string;

  @Column({name: 'time_delay_2', type: 'varchar', length: 5})
  public timeDelay2: string;

  @Column({name: 'time_early_2', type: 'varchar', length: 5})
  public timeEarly2: string;

  @Column({name: 'time_come_off_2', type: 'varchar', length: 5})
  public timeComeOff2: string;

  @Column({name: 'time_leave_off_2', type: 'varchar', length: 5})
  public timeLeaveOff2: string;

  @Column({name: 'time_keeping_strategy_id', type: 'int', nullable: true})
  public timeKeepingStrategyId: number;

  @Column({name: 'created_at', type: 'bigint', nullable: true})
  public createdAt: number;

  @Column({name: 'updated_at', type: 'bigint', nullable: true})
  public updatedAt: number;
}
