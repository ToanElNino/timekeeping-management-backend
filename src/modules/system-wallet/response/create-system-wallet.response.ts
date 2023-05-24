import {ApiProperty} from '@nestjs/swagger';

export class CreateSystemWalletResponse {
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

  // @ApiProperty({
  //   example: 'E9873D79C6D87DC0FB6A5778633389F4453213303DA61F20BD67FC233AA33262',
  //   type: String,
  // })
  // public privateKey: string;

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
