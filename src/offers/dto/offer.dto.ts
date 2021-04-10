import { IsDate, IsNumber, IsString } from 'class-validator';

export class OfferDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  salary_from: number;

  @IsNumber()
  salary_to: number;

  @IsDate()
  paid_till: Date;

  @IsNumber()
  profession_id: number;

  @IsNumber()
  specialization_id: number;

  @IsNumber()
  company_id: number;
}
