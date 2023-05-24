import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {nowInMillis} from '../../shared/Utils';

@Entity('user_device')
@Index('wallet_address', ['walletAddress'], {unique: true})
@Index('firebase_token', ['firebaseToken'], {unique: true})
export class UserDevice {
  @PrimaryGeneratedColumn({name: 'id', type: 'int'})
  public id: number;

  @Column({
    name: 'wallet_address',
    type: 'varchar',
    length: 256,
    nullable: false,
    unique: false,
  })
  public walletAddress: string;

  @Column({
    name: 'firebase_token',
    type: 'varchar',
    length: 500,
    nullable: false,
    unique: false,
  })
  public firebaseToken: string;

  @Column({
    name: 'is_active',
    type: 'boolean',
    nullable: false,
    unique: false,
  })
  public isActive: boolean;

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
