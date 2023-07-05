import {ApiProperty} from '@nestjs/swagger';

export class AcceptRequestBody {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  public requestId: number;
}
