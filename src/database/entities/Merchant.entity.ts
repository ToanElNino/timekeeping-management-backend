/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryColumn,
} from 'typeorm';
import {nowInMillis} from '../../shared/Utils';
import {IMerchant} from '../interfaces/IMerchant.interface';

@Entity('merchant')
export class Merchant implements IMerchant {
  @Column({
    name: 'name',
    type: 'varchar',
    length: 256,
    nullable: false,
  })
  public name: string;

  @Column({
    name: 'avatar',
    type: 'varchar',
    nullable: false,
  })
  public avatar: string;

  @Column({
    name: 'longitude',
    type: 'float',
    nullable: true,
  })
  public longitude: number;

  @Column({
    name: 'latitude',
    type: 'float',
    nullable: true,
  })
  public latitude: number;

  @Column({name: 'chain_id', type: 'bigint'})
  chainId: number;

  @PrimaryColumn({
    name: 'merchant_wallet',
    type: 'varchar',
    nullable: false,
  })
  public merchant_wallet: string;

  @Column({
    name: 'address',
    type: 'varchar',
    nullable: false,
  })
  public address: string;

  @Column({
    name: 'status',
    type: 'varchar',
    default: 'ACTIVE',
    nullable: false,
  })
  public status: string;

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
