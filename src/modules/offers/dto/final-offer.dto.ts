import { CompanyLocation } from 'src/modules/companies/entities/companyLocation.entity';
import { AgreementType } from '../entities/agreementType.entity';
import { OfferDto } from './offer.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class FinalOfferDto extends OfferDto {
  @ApiProperty()
  @IsNumber()
  company_id: number;

  @ApiProperty()
  @IsOptional()
  agreement_types?: AgreementType[];

  @ApiProperty()
  @IsOptional()
  locations?: CompanyLocation[];
}
