import {nowInMillis} from '../../shared/Utils';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('transaction')
export class Transaction {
  @PrimaryGeneratedColumn({name: 'id', type: 'int'})
  public id: number;

  @Column({name: 'txn_hash', type: 'varchar', length: 256})
  txnHash: string;

  @Column({name: 'chain_id', type: 'bigint'})
  chainId: number;

  @Column({name: 'amount', type: 'decimal', precision: 40, scale: 20})
  amount: number;

  @Column({name: 'token_address', type: 'varchar', length: 256})
  tokenAddress: string;

  @Column({name: 'from_address', type: 'varchar', length: 256})
  fromAddress: string;

  @Column({name: 'to_address', type: 'varchar', length: 256})
  toAddress: string;

  @Column({name: 'status', type: 'varchar', length: 50})
  status: string;

  @Column({name: 'block_number', type: 'bigint', nullable: true})
  blockNumber: number;

  @Column({name: 'block_timestamp', type: 'bigint', nullable: true})
  blockTimestamp: number;

  @Column({
    name: 'txn_fee',
    type: 'decimal',
    precision: 40,
    scale: 20,
    nullable: true,
  })
  txnFee: number;

  @Column({name: 'gas_limit', type: 'bigint', nullable: true})
  gasLimit: number;

  @Column({
    name: 'gas_price',
    type: 'decimal',
    precision: 40,
    scale: 20,
    nullable: true,
  })
  gasPrice: number;

  @Column({name: 'created_at', type: 'bigint', nullable: true})
  public createdAt: number;

  @Column({name: 'updated_at', type: 'bigint'})
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
