import {ApiProperty} from '@nestjs/swagger';
import {IsIn, IsOptional} from 'class-validator';
import {TokenMultichainResponse} from './TokenMultichainResponse.dto';

export class TokenResponse {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  public id: number;

  @ApiProperty({
    type: String,
    example: 'Ethereum',
  })
  public name: string;

  @ApiProperty({
    type: String,
    example: 'ETH',
  })
  public symbol: string;

  @ApiProperty({
    type: String,
    example: 'ACTIVE',
  })
  @IsIn(['ACTIVE', 'INACTIVE'])
  public status: string;

  @ApiProperty({
    type: Boolean,
    example: true,
  })
  public isNativeToken: boolean;

  @ApiProperty({
    type: String,
    example:
      'https://orbit-storage.s3.ap-southeast-1.amazonaws.com/velo-orbit/icon.png',
  })
  public icon: string;

  @ApiProperty({
    type: String,
    example: 'DEFAULT',
  })
  @IsIn(['DEFAULT', 'CUSTOM'])
  public type: string;

  @ApiProperty({
    type: Number,
    example: 123456789,
  })
  public createdAt: string;

  @ApiProperty({
    type: Number,
    example: 123456789,
  })
  public updatedAt: string;

  @ApiProperty({
    type: [TokenMultichainResponse],
  })
  public multichain: [TokenMultichainResponse];
}
