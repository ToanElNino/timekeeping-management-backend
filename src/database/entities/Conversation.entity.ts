import {nowInMillis} from '../../shared/Utils';
import {
  BeforeInsert,
  Column,
  PrimaryGeneratedColumn,
  BeforeUpdate,
  Entity,
  Index,
} from 'typeorm';
@Entity('conversation')
@Index('from_address', ['fromAddress'], {unique: true})
@Index('to_address', ['toAddress'], {unique: true})
export class Conversation {
  @PrimaryGeneratedColumn({name: 'id', type: 'int'})
  public id: number;

  @Column({
    name: 'from_address',
    type: 'varchar',
    length: 256,
    nullable: false,
  })
  public fromAddress: string;

  @Column({
    name: 'to_address',
    type: 'varchar',
    length: 256,
    nullable: false,
  })
  public toAddress: string;

  @Column({
    name: 'status',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  public status: string;

  @Column({
    name: 'created_at',
    type: 'bigint',
    nullable: false,
  })
  public createdAt: number;

  @Column({
    name: 'updated_at',
    type: 'bigint',
    nullable: true,
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
