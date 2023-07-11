import {ApiProperty} from '@nestjs/swagger';

export class RejectRequestBody {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  public requestId: number;

  @ApiProperty({
    type: String,
    example: 'ABC',
  })
  public reason: string;
}
