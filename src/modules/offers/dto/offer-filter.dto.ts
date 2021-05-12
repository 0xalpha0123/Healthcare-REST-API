import {
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OfferFilterDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty()
  @IsNumberString()
  @IsOptional()
  salary_from?: number;

  @ApiProperty()
  @IsNumberString()
  @IsOptional()
  salary_to?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  agreement_type_id?: number;

  @ApiProperty()
  @IsNumberString()
  @IsOptional()
  profession_id?: number;

  @ApiProperty()
  @IsNumberString()
  @IsOptional()
  specialization_id?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  company_id?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  order?: string;
}
