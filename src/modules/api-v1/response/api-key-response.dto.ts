import {ApiProperty} from '@nestjs/swagger';

export class ApiKeyResponse {
  @ApiProperty({
    type: Number,
    example: '1',
  })
  id: number;

  @ApiProperty({
    type: String,
    example: '0be6703d8eb931d53a27',
  })
  apiKey: string;

  @ApiProperty({
    type: Number,
    example: 'ACTIVE',
  })
  status: string;

  @ApiProperty({
    type: Number,
    example: '123456789',
  })
  createdAt: number;

  @ApiProperty({
    type: Number,
    example: '123456789',
  })
  updatedAt: number;
}
