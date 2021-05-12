import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OfferDto {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsOptional()
  salary_from?: number;

  @ApiProperty()
  @IsOptional()
  salary_to?: number;

  @ApiProperty()
  @IsOptional()
  agreement_type_ids: number[];

  @ApiProperty()
  @IsOptional()
  company_location_ids: number[];

  @ApiProperty()
  @IsNotEmpty()
  profession_id: number;

  @ApiProperty()
  @IsOptional()
  specialization_id: number;

  @ApiProperty()
  @IsNotEmpty()
  active: boolean;
}

export class OfferParamsDto {
  id: number;
}
