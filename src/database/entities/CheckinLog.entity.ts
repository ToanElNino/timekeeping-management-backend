import {nowInMillis} from '../../shared/Utils';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryColumn,
} from 'typeorm';

@Entity('checkin_log')
export class CheckinLog {
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

  @Column({name: 'time_record_number', type: 'bigint', nullable: false})
  public timeRecordNumber: number;

  @Column({name: 'created_at', type: 'bigint', nullable: true})
  public createdAt: number;

  @Column({name: 'updated_at', type: 'bigint', nullable: true})
  public updatedAt: number;
}
