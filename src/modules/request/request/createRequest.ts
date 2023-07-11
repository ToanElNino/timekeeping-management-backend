import {ApiProperty} from '@nestjs/swagger';

export class CreateCICORequest {
  @ApiProperty({
    type: String,
    example: 'Forget to check before leaving',
  })
  public reason: string;

  @ApiProperty({
    type: Number,
    example: 1681355502,
  })
  public Time: number;

  @ApiProperty({
    type: String,
    example: 'CHECK_IN',
  })
  public Type: string;
}

export class CreateDayOffRequest {
  @ApiProperty({
    type: String,
    example: 'Family business',
  })
  public reason: string;

  @ApiProperty({
    type: Number,
    example: 1681355502,
  })
  public dayTimeStamp: number;

  @ApiProperty({
    type: String,
    example: 'MORNING',
  })
  public workingDayPart: string;

  @ApiProperty({
    type: String,
    example: 'PAID_LEAVE',
  })
  public typeLeave: string;
}

export class CreateWorkFromHomeRequest {
  @ApiProperty({
    type: String,
    example: 'Covid 19',
  })
  public reason: string;

  @ApiProperty({
    type: Number,
    example: 1681355502,
  })
  public dayTimeStamp: number;

  @ApiProperty({
    type: String,
    example: 'MORNING',
  })
  public workingDayPart: string;
}
