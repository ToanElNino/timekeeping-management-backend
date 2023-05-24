import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty} from 'class-validator';

export class UpdateMetaData {
  @ApiProperty({
    type: String,
    example: '0x400EBf02D1DA76Ee500b368Ce8B5305761b51D33',
  })
  @IsNotEmpty()
  tokenAddress: string;

  @ApiProperty({
    type: [String],
    example: '[1,2,3,4]',
  })
  @IsNotEmpty()
  tokenIds: string[];
}
