import {ApiProperty} from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import {PagingDto} from './paging.dto';

export class searchPrice {
  @ApiProperty({required: true})
  @Min(1)
  @IsNumber()
  startPrice: number;

  @ApiProperty({required: true})
  @Min(1)
  @IsNumber()
  endPrice: number;

  @ApiProperty({required: true})
  @IsString()
  currency: string;
}

export enum searchSort {
  NONE,
  NEWEST,
  OLDEST,
  POPULAR,
  LATEST,
  MOST_TRADED,
  PRICING_DESC,
  PRICING_ASC,
}

export enum searchStatus {
  ALL,
  FOR_SALE,
  HAS_OFFERS,
}

export class searchDto extends PagingDto {
  @ApiProperty({required: false})
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({required: false})
  @IsOptional()
  @IsObject()
  price: searchPrice;

  @ApiProperty({example: [0, 8], required: false})
  @IsOptional()
  @IsArray()
  sort: searchSort[];

  @ApiProperty({required: false})
  @IsOptional()
  @IsArray()
  categories: string[];

  @ApiProperty({required: false})
  @IsOptional()
  @IsArray()
  brands: string[];

  @ApiProperty({required: false})
  @IsOptional()
  @IsArray()
  collections: string[];

  @ApiProperty({example: [0, 2], required: false})
  @IsOptional()
  @IsArray()
  searchStatuses: searchStatus[];
}
