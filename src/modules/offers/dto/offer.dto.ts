import {  IsOptional } from 'class-validator';

export class OfferDto {
  title: string;

  description: string;

  @IsOptional()
  salary_from?: number;

  @IsOptional()
  salary_to?: number;

  @IsOptional()
  agreement_type_ids: number[];

  @IsOptional()
  company_location_ids: number[];

  profession_id: number;

  @IsOptional()
  specialization_id: number;

}
