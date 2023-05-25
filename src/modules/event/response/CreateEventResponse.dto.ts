import {ApiProperty} from '@nestjs/swagger';

export class CreateEventResponse {
  @ApiProperty({
    example: 'New transaction!',
    type: String,
  })
  public title: string;

  @ApiProperty({
    type: String,
    example: 'You have been received new transaction',
  })
  public description: string;

  @ApiProperty({
    type: String,
    example: 'GENERAL_TOPIC',
  })
  public topic: string;

  @ApiProperty({
    type: String,
    example: '0x93902d47bE75950242D2557588cF45F0D3da2812',
  })
  public address: string;

  @ApiProperty({
    type: String,
    example: 'NOTIFICATION',
  })
  public type: string;

  @ApiProperty({
    type: String,
    example: 'NEW',
  })
  public status: string;

  @ApiProperty({type: Number, example: 1681355502})
  public datetimeStart: number;

  @ApiProperty({type: Number, example: 1681355502})
  public datetimeEnd: number;

  @ApiProperty({type: Number, example: 1681355502})
  public createdAt: number;

  @ApiProperty({type: Number, example: 1681355502})
  public updatedAt: number;
}
