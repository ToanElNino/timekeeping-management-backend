import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsString, MaxLength, MinLength} from 'class-validator';
import {Causes} from 'src/config/exception/causes';

export class UpdateChainRequest {
  @ApiProperty({
    example: 3,
    type: Number,
  })
  public id: number;

  @ApiProperty({
    example: 'Ethereum',
    type: String,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @IsNotEmpty()
  public chainName: string;

  @ApiProperty({
    example: 'ETH',
    type: String,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @IsNotEmpty()
  public symbol: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
  })
  public iconFile: any;

  @ApiProperty({
    type: String,
    example: 'https://example',
  })
  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  @IsNotEmpty()
  public scanApi: string;

  @ApiProperty({
    type: String,
    example: 'https://example',
  })
  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  @IsNotEmpty()
  public rpcEndpoint: string;

  @ApiProperty({
    type: String,
    example: 'https://example',
  })
  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  @IsNotEmpty()
  public explorerEndpoint: string;
}
