import {ApiProperty} from '@nestjs/swagger';
import {IsNumber, IsString} from 'class-validator';

export class UpdateUser {
  @ApiProperty({
    type: String,
    example: 'xxxxx',
  })
  @IsString()
  vendorName: string;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    type: String,
    example: '[123123123,....]',
  })
  @IsString()
  brandIds: string;
}
