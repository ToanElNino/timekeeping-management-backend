import {ApiProperty} from '@nestjs/swagger';

export class CreateRequest {
  @ApiProperty({
    type: Number,
  })
  public tenantId: number;

  @ApiProperty({
    type: Number,
  })
  public userId: number;

  @ApiProperty({
    type: Number,
  })
  public type: number;

  @ApiProperty({
    type: Number,
  })
  public leaveType: number;

  @ApiProperty({
    type: String,
  })
  public reason: string;

  @ApiProperty({
    type: Number,
  })
  public workingDay: number;

  @ApiProperty({
    type: String,
  })
  public CITime: string;

  @ApiProperty({
    type: String,
  })
  public COTime: string;

  @ApiProperty({
    type: String,
  })
  public CICODay: string;

  @ApiProperty({
    type: String,
  })
  public workingDayPart: string;

  @ApiProperty({
    type: String,
  })
  public dayFrom: string;

  @ApiProperty({
    type: String,
  })
  public dayTo: string;
}
