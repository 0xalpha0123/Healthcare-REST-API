import { IsNumber, IsNumberString, IsOptional, IsString } from 'class-validator';

export class OfferFilterDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsNumberString()
  @IsOptional()
  salary_from?: number;

  @IsNumberString()
  @IsOptional()
  salary_to?: number;

  @IsNumber()
  @IsOptional()
  agreement_type_id: number;

  @IsNumberString()
  @IsOptional()
  profession_id: number;

  @IsNumberString()
  @IsOptional()
  specialization_id: number;

  @IsNumber()
  @IsOptional()
  company_id: number;

  @IsString()
  @IsOptional()
  city: string;
}
