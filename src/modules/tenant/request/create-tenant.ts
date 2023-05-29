import {ApiProperty} from '@nestjs/swagger';

export class CreateTenantBody {
  @ApiProperty({
    type: String,
    example: 'Bach khoa',
  })
  name: string;

  @ApiProperty({
    type: String,
    example: 'HUST',
  })
  code: string;
}
