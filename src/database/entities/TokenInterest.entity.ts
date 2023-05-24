import {BeforeInsert, Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import {nowInMillis} from '../../shared/Utils';

@Entity('token_interest')
export class TokenInterest {
  @PrimaryGeneratedColumn({name: 'id', type: 'int'})
  public id: number;

  @Column({name: 'user_wallet', type: 'varchar', nullable: false, length: 256})
  public userWallet: string;

  @Column({
    name: 'token_address',
    type: 'varchar',
    nullable: false,
    length: 256,
  })
  public tokenAddress: string;

  @Column({name: 'created_at', type: 'bigint', nullable: false})
  public createdAt: number;

  @BeforeInsert()
  public updateCreateDates() {
    this.createdAt = nowInMillis();
  }
}
