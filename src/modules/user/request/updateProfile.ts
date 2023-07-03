import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {IsNotEmpty, IsString, MaxLength, MinLength} from 'class-validator';
import {Causes} from 'src/config/exception/causes';

export class UpdateProfileRequest {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  public userId: number;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  public checkinLogId: number;

  @ApiProperty({
    type: String,
    example: 'Nguyen Quoc Toan',
  })
  public name: string;

  @ApiProperty({
    type: String,
    example: 'toannguyen@gmail.com',
  })
  public email: string;

  @ApiProperty({
    type: String,
    example: '+84386417319',
  })
  public phoneNumber: string;

  @ApiProperty({
    type: String,
    example: '32 Le Thanh Nghi, Ha Noi',
  })
  public homeAddress: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
  })
  public avatarFile: any;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  public departmentId: number;

  @ApiProperty({
    type: Number,
    example: 1688365748592,
  })
  public onboardAt: number;
}

export class StaffUpdateProfileRequest {
  @ApiProperty({
    type: String,
    example: 'Nguyen Quoc Toan',
  })
  public name: string;

  @ApiProperty({
    type: String,
    example: 'toannguyen@gmail.com',
  })
  public email: string;

  @ApiProperty({
    type: String,
    example: '+84386417319',
  })
  public phoneNumber: string;

  @ApiProperty({
    type: String,
    example: '32 Le Thanh Nghi, Ha Noi',
  })
  public homeAddress: string;
}

export class StaffUpdateAvatarRequest {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
  })
  public avatarFile: any;
}
