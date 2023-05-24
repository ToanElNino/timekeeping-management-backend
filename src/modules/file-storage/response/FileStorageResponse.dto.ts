import {ApiProperty} from '@nestjs/swagger';

export class FileStorageResponse {
  @ApiProperty({
    example: 'https:/localhost:3001/icon.png',
    type: Number,
  })
  public url: string;
}
