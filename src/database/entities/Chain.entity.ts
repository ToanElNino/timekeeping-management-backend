import {nowInMillis} from '../../shared/Utils';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryColumn,
} from 'typeorm';

@Entity('chain')
export class Chain {
  @PrimaryColumn({name: 'id', type: 'bigint', unique: true})
  id: number;

  @Column({name: 'chain_name', type: 'varchar', length: 50})
  chainName: string;

  @Column({name: 'icon', type: 'varchar', length: 256, nullable: true})
  icon: string;

  @Column({name: 'symbol', type: 'varchar', length: 100})
  symbol: string;

  @Column({name: 'scan_api', type: 'varchar', length: 256, nullable: true})
  scanApi: string;

  @Column({name: 'rpc_endpoint', type: 'varchar', length: 256, nullable: true})
  rpcEndpoint: string;

  @Column({
    name: 'explorer_endpoint',
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  explorerEndpoint: string;

  @Column({name: 'status', type: 'varchar', length: 50, default: 'ACTIVE'})
  status: string;

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
