import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {nowInMillis} from '../../shared/Utils';

// import Kms from '../encrypt/Kms';

@Entity('notification')
@Index('user_wallet', ['userWallet'], {unique: true})
export class Notification {
  @PrimaryGeneratedColumn({name: 'id', type: 'int'})
  public id: number;

  @Column({
    name: 'user_wallet',
    type: 'varchar',
    length: 255,
    unique: false,
    nullable: true,
  })
  public userWallet: string;

  @Column({
    name: 'title',
    type: 'varchar',
    length: 256,
    unique: false,
    nullable: false,
  })
  public title: string;

  @Column({name: 'message', type: 'varchar', length: 500, nullable: false})
  public message: string;

  @Column({
    name: 'is_read',
    type: 'tinyint',
    width: 1,
    nullable: true,
    default: 0,
  })
  public isRead: boolean;

  @Column({
    name: 'is_global',
    type: 'tinyint',
    width: 1,
    nullable: false,
    default: 0,
  })
  public isGlobal: boolean;

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
