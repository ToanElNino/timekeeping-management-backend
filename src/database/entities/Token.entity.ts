import {nowInMillis} from '../../shared/Utils';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {ICurrencyTokenInterface} from '../interfaces/ICurrencyToken.interface';

@Entity('token')
export class Token implements ICurrencyTokenInterface {
  @PrimaryGeneratedColumn({name: 'id', type: 'int'})
  public id: number;

  @Column({name: 'name', type: 'varchar', length: 100})
  name: string;

  @Column({name: 'symbol', type: 'varchar', length: 100})
  symbol: string;

  @Column({name: 'status', type: 'varchar', length: 50, default: 'ACTIVE'})
  status: string;

  @Column({name: 'is_native_token', type: 'boolean'})
  isNativeToken: boolean;

  @Column({name: 'icon', type: 'varchar', length: 256, nullable: true})
  icon: string;

  @Column({name: 'user_wallet', type: 'varchar', length: 256, nullable: true})
  userWallet: string;

  @Column({name: 'type', type: 'varchar', length: 20})
  type: string; //DEFAULT or CUSTOM

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
