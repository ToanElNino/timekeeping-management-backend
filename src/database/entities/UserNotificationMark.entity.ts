import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {nowInMillis} from '../../shared/Utils';

// import Kms from '../encrypt/Kms';

@Entity('user_notification_mark')
export class UserNotificationMark {
  @PrimaryGeneratedColumn({name: 'id', type: 'int'})
  public id: number;

  @Column({name: 'notification_id', type: 'int', nullable: false})
  public notificationId: number;

  @Column({
    name: 'user_wallet',
    type: 'varchar',
    length: 255,
    unique: true,
  })
  public userWallet: string;

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
