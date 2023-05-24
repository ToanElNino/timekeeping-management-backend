/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {nowInMillis} from '../../shared/Utils';

@Entity('payment_request')
@Index('token_address', ['tokenAddress'], {unique: true})
@Index('from_address', ['fromAddress'], {unique: true})
@Index('to_address', ['toAddress'], {unique: true})
export class PaymentRequest {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    name: 'txn_hash',
    type: 'varchar',
    length: 256,
    nullable: false,
    unique: true,
  })
  public txnHash: string;

  @Column({name: 'chain_id', type: 'int', nullable: false})
  public chainId: number;

  @Column({
    name: 'token_address',
    type: 'varchar',
    length: 256,
    nullable: false,
  })
  public tokenAddress: string;

  @Column({name: 'from_address', type: 'varchar', length: 256, nullable: false})
  public fromAddress: string;

  @Column({name: 'to_address', type: 'varchar', length: 256, nullable: false})
  public toAddress: string;

  @Column({
    name: 'amount',
    type: 'decimal',
    precision: 40,
    scale: 20,
    nullable: false,
  })
  public amount: number;

  @Column({name: 'status', type: 'varchar', length: 50, nullable: false})
  public status: string;

  @Column({name: 'created_at', type: 'bigint', nullable: false})
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
