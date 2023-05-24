import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsString, MaxLength, MinLength} from 'class-validator';
import {Causes} from 'src/config/exception/causes';

export class CreateSystemWalletReq {
  @ApiProperty({
    example: '0x1ABC7154748D1CE5144478CDEB574AE244B939B5',
    type: String,
  })
  @IsString({message: JSON.stringify(Causes.WALLET_ADDRESS_STRING)})
  @MinLength(10)
  @MaxLength(256)
  @IsNotEmpty({message: JSON.stringify(Causes.WALLET_ADDRESS_EMPTY)})
  public systemWallet: string;

  @ApiProperty({
    example: 632345454,
    type: Number,
  })
  @IsNotEmpty()
  public chainId: number;

  // @ApiProperty({
  //   example: 'E9873D79C6D87DC0FB6A5778633389F4453213303DA61F20BD67FC233AA33262',
  //   type: String,
  // })
  // public privateKey: string;

  @ApiProperty({
    type: String,
    example: 'ETH',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @IsNotEmpty()
  public name: string;
}
