import {nowInMillis} from '../../shared/Utils';
import {BeforeInsert, BeforeUpdate, Column, Entity, Index} from 'typeorm';
import {PrimaryGeneratedColumn} from 'typeorm';

@Entity('message')
@Index('owner_address', ['ownerAddress'], {unique: true})
export class Message {
  @PrimaryGeneratedColumn({
    name: 'id',
    type: 'int',
  })
  id: number;

  @Column({
    name: 'conversation_id',
    type: 'bigint',
    nullable: false,
  })
  public conversationId: number;

  @Column({
    name: 'owner_address',
    type: 'varchar',
    nullable: false,
    length: 256,
  })
  ownerAddress: string;

  @Column({
    name: 'message',
    type: 'varchar',
    length: 1000,
    nullable: false,
  })
  public message: string;

  @Column({
    name: 'created_at',
    type: 'bigint',
    nullable: false,
  })
  public createdAt: number;
  @Column({
    name: 'updated_at',
    type: 'bigint',
    nullable: false,
  })
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
