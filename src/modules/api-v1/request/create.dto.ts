import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsString} from 'class-validator';

export class Create {
  @ApiProperty({
    type: Number,
    example: 0,
  })
  @IsNotEmpty()
  collectionId: number;

  @ApiProperty({
    type: String,
    example: 'name',
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}
