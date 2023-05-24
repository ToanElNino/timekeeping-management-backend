import {ApiProperty} from '@nestjs/swagger';

export class ChainResponse {
  @ApiProperty({
    example: 3,
    type: Number,
  })
  public id: number;

  @ApiProperty({
    example: 'Ethereum',
    type: String,
  })
  public chainName: string;

  @ApiProperty({
    example: 'ETH',
    type: String,
  })
  public symbol: string;

  @ApiProperty({
    type: String,
    example: 'https://icon.jpg',
  })
  public icon: string;

  @ApiProperty({
    type: String,
    example: 'ACTIVE',
  })
  public status: string;

  @ApiProperty({
    type: String,
    example: 'https://example',
  })
  public scanApi: string;

  @ApiProperty({
    type: String,
    example: 'https://example',
  })
  public rpcEndpoint: string;

  @ApiProperty({
    type: String,
    example: 'https://example',
  })
  public explorerEndpoint: string;

  @ApiProperty({type: Number, example: 1681355502})
  public createdAt: number;

  @ApiProperty({type: Number, example: 1681355502})
  public updatedAt: number;
}
