import { IsOptional, IsString } from 'class-validator';

export class CompanyFilterDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsString()
  @IsOptional()
  city?: string;
}
