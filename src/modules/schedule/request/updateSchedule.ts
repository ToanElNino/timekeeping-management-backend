import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {IsNotEmpty, IsString, MaxLength, MinLength} from 'class-validator';
import {Causes} from 'src/config/exception/causes';

export class UpdateScheduleRequest {
  @ApiProperty({
    type: Number,
  })
  public id: number;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  public tenantId: number;

  @ApiProperty({
    type: String,
    example: 'TEST',
  })
  public name: string;

  @ApiPropertyOptional({
    type: Number,
    example: 1685966591029,
  })
  public dayFrom: number;

  @ApiPropertyOptional({
    type: Number,
    example: 1685966591029,
  })
  public dayTo: number;

  @ApiPropertyOptional({
    type: String,
    example: '08:30',
  })
  public timeStart1: string;

  @ApiPropertyOptional({
    type: String,
    example: '12:00',
  })
  public timeEnd1: string;

  @ApiPropertyOptional({
    type: String,
    example: '08:45',
  })
  public timeDelay1: string;

  @ApiPropertyOptional({
    type: String,
    example: '11:45',
  })
  public timeEarl1: string;

  @ApiPropertyOptional({
    type: String,
    example: '09:30',
  })
  public timeComeOff1: string;

  @ApiPropertyOptional({
    type: String,
    example: '11:00',
  })
  public timeLeaveOff1: string;

  @ApiPropertyOptional({
    type: String,
    example: '13:00',
  })
  public timeStart2: string;

  @ApiPropertyOptional({
    type: String,
    example: '17:30',
  })
  public timeEnd2: string;

  @ApiPropertyOptional({
    type: String,
    example: '13:15',
  })
  public timeDelay2: string;

  @ApiPropertyOptional({
    type: String,
    example: '17:15',
  })
  public timeEarl2: string;

  @ApiPropertyOptional({
    type: String,
    example: '14:00',
  })
  public timeComeOff2: string;

  @ApiPropertyOptional({
    type: String,
    example: '16:30',
  })
  public timeLeaveOff2: string;

  @ApiPropertyOptional({
    type: String,
    example: '07:30',
  })
  public earliestTime: string;

  @ApiPropertyOptional({
    type: String,
    example: '18:30',
  })
  public latestTime: string;
}
