import {ApiProperty} from '@nestjs/swagger';

export class GetSystemWalletResponse {
  @ApiProperty({
    example: '0x1ABC7154748D1CE5144478CDEB574AE244B939B5',
    type: String,
  })
  public systemWallet: string;

  @ApiProperty({
    example: 632345454,
    type: Number,
  })
  public chainId: Number;

  @ApiProperty({
    type: String,
    example: 'ETH',
  })
  public name: string;

  @ApiProperty({
    type: String,
    example: 'ACTIVE',
  })
  public status: string;

  @ApiProperty({type: Number, example: 1681355502})
  public createdAt: number;

  @ApiProperty({type: Number, example: 1681355502})
  public updatedAt: number;
}
