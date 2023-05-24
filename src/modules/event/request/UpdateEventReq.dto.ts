import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsString, MaxLength, MinLength} from 'class-validator';
import {Causes} from 'src/config/exception/causes';

export class UpdateEventRequest {
  @ApiProperty({
    example: 1,
    type: Number,
  })
  @IsNotEmpty()
  public id: number;

  @ApiProperty({
    example: 'New transaction!',
    type: String,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(256)
  @IsNotEmpty()
  public title: string;

  @ApiProperty({
    type: String,
    example: 'You have been received new transaction',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(500)
  @IsNotEmpty()
  public description: string;

  @ApiProperty({
    type: String,
    example: 'GENERAL_TOPIC',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @IsNotEmpty()
  public topic: string;

  @ApiProperty({
    type: String,
    example: '0x93902d47bE75950242D2557588cF45F0D3da2812',
  })
  @IsString({message: JSON.stringify(Causes.ADMIN_ADDRESS_STRING)})
  @MinLength(10)
  @MaxLength(256)
  @IsNotEmpty()
  public address: string;

  @ApiProperty({
    type: String,
    example: 'NOTIFICATION',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @IsNotEmpty()
  public type: string;

  @ApiProperty({type: Number, example: 1681355502})
  @IsNotEmpty()
  public datetimeStart: number;

  @ApiProperty({type: Number, example: 1681355502})
  @IsNotEmpty()
  public datetimeEnd: number;
}
