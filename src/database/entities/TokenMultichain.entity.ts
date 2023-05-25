import {nowInMillis} from '../../shared/Utils';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('token-multichain')
export class TokenMultichain {
  @PrimaryGeneratedColumn({name: 'id', type: 'int'})
  id: number;

  @Column({name: 'token_id', type: 'bigint'})
  tokenId: number;

  @PrimaryColumn({name: 'token_address', type: 'varchar', length: 256})
  tokenAddress: string;

  @Column({name: 'chain_id', type: 'bigint'})
  chainId: number;

  @Column({name: 'decimal', type: 'bigint'})
  decimal: number;

  @Column({name: 'created_at', type: 'bigint', nullable: false})
  createdAt: number;

  @Column({name: 'updated_at', type: 'bigint', nullable: true})
  updatedAt: number;

  @BeforeInsert()
  updateCreateDates() {
    this.createdAt = nowInMillis();
    this.updatedAt = nowInMillis();
  }

  @BeforeUpdate()
  updateUpdateDates() {
    this.updatedAt = nowInMillis();
  }
}
