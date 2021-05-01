import { IsNotEmpty, IsOptional } from 'class-validator';

export class OfferDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsOptional()
  salary_from?: number;

  @IsOptional()
  salary_to?: number;

  @IsOptional()
  agreement_type_ids: number[];

  @IsOptional()
  company_location_ids: number[];

  @IsNotEmpty()
  profession_id: number;

  @IsOptional()
  specialization_id: number;

  @IsNotEmpty()
  active: boolean;

}
