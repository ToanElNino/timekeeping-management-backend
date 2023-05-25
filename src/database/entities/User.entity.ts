/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryColumn,
} from 'typeorm';
import {nowInMillis} from '../../shared/Utils';

@Entity('user')
@Index('user_wallet', ['userWallet'], {unique: true})
@Index('referral_code', ['referralCode'], {unique: true})
export class User {
  @PrimaryColumn({
    name: 'user_wallet',
    type: 'varchar',
    length: 255,
    unique: true,
  })
  public userWallet: string;

  @Column({
    name: 'referral_code',
    type: 'varchar',
    length: 100,
    unique: true,
    nullable: false,
  })
  public referralCode: string;

  @Column({
    name: 'account_name',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  public accountName: string;

  @Column({
    name: 'refer_by',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  public referBy: string;

  @Column({
    name: 'config_body',
    type: 'json',
    nullable: true,
  })
  public configBody: string;

  @Column({
    name: 'default_currency',
    type: 'varchar',
    nullable: true,
    length: 255,
  })
  public defaultCurrency: string;

  @Column({
    name: 'default_chain_id',
    type: 'bigint',
    nullable: true,
  })
  public defaultChainId: number;

  @Column({
    name: 'status',
    type: 'varchar',
    length: 50,
    default: 'ACTIVE',
  })
  public status: string;

  // @ManyToMany(() => Merchant)
  // @JoinTable({
  //   name: 'merchant_interest',
  //   joinColumn: {
  //     name: 'user_wallet',
  //   },
  //   inverseJoinColumn: {
  //     name: 'merchant_wallet',
  //   },
  // })
  // public merchants: Merchant[];

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
