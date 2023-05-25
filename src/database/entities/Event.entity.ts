import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {nowInMillis} from '../../shared/Utils';

// import Kms from '../encrypt/Kms';

@Entity('event')
@Index('address', ['address'], {unique: false})
export class Event {
  @PrimaryGeneratedColumn({name: 'id', type: 'int'})
  id: number;

  @Column({
    name: 'title',
    type: 'varchar',
    length: 256,
    unique: false,
    nullable: false,
  })
  public title: string;

  @Column({name: 'description', type: 'varchar', length: 500, nullable: false})
  public description: string;

  @Column({name: 'topic', type: 'varchar', length: 100, nullable: true})
  public topic: string;

  @Column({
    name: 'address',
    type: 'varchar',
    length: 500,
    nullable: false,
    unique: true,
  })
  public address: string;

  @Column({name: 'datetime_start', type: 'bigint', nullable: false})
  public datetimeStart: number;

  @Column({name: 'datetime_end', type: 'bigint', nullable: false})
  public datetimeEnd: number;

  @Column({name: 'status', type: 'varchar', nullable: false, length: 50})
  public status: string;

  @Column({name: 'type', type: 'varchar', nullable: false, length: 50})
  public type: string;

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
