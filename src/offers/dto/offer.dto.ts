import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class OfferDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  salary_from?: number;

  @IsNumber()
  @IsOptional()
  salary_to?: number;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  paid_till?: Date;

  @IsNumber()
  agreement_type_id: number;

  @IsNumber()
  profession_id: number;

  @IsNumber()
  specialization_id: number;

  @IsNumber()
  company_id: number;
}
