import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsString, MaxLength, MinLength} from 'class-validator';
import {Causes} from 'src/config/exception/causes';

export class ChangeWalletStatusReq {
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
    example: 123454,
    type: Number,
  })
  @IsNotEmpty()
  public chainId: number;

  @ApiProperty({
    example: 'INACTIVE',
    type: String,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @IsNotEmpty()
  public newStatus: string;
}
