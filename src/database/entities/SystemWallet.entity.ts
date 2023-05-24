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

@Entity('system_wallet')
// @Index('system_wallet', ['apiKey'], {unique: true})
export class SystemWallet {
  @PrimaryColumn({
    name: 'system_wallet',
    type: 'varchar',
    length: 256,
    unique: true,
    nullable: false,
  })
  public systemWallet: string;

  @Column({name: 'chain_id', type: 'int', unique: false, nullable: false})
  public chainId: number;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 100,
    unique: false,
    nullable: false,
  })
  public name: string;

  @Column({name: 'private_key', type: 'varchar', length: 500})
  public privateKey: string;

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
