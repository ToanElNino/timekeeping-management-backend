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

@Entity('transaction_swap')
@Index('from_chain_id', ['fromChainId'], {unique: false})
@Index('from_amount', ['fromAmount'], {unique: false})
export class TransactionSwap {
  @PrimaryGeneratedColumn({name: 'id', type: 'int'})
  id: number;

  @Column({
    name: 'from_txn_hash',
    type: 'varchar',
    length: 256,
    unique: false,
    nullable: true,
  })
  public fromTxnHash: string;

  @Column({name: 'from_chain_id', type: 'int', nullable: true, unique: false})
  public fromChainId: number;

  @Column({
    name: 'from_token_address',
    type: 'varchar',
    length: 256,
    unique: false,
    nullable: true,
  })
  public fromTokenAddress: string;

  @Column({
    name: 'from_amount',
    type: 'decimal',
    precision: 40,
    scale: 20,
    unique: false,
    nullable: false,
  })
  public fromAmount: Number;

  @Column({
    name: 'to_txn_hash',
    type: 'varchar',
    length: 256,
    unique: false,
    nullable: true,
  })
  public toTxnHash: string;
  @Column({name: 'to_chain_id', type: 'int', nullable: true, unique: false})
  public toChainId: number;

  @Column({
    name: 'to_token_address',
    type: 'varchar',
    length: 256,
    unique: false,
    nullable: true,
  })
  public toTokenAddress: string;

  @Column({
    name: 'to_amount',
    type: 'decimal',
    precision: 40,
    scale: 20,
    unique: false,
    nullable: false,
  })
  public toAmount: Number;

  @Column({name: 'status', type: 'varchar', length: 50, nullable: false})
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
