import { CompanyLocation } from "src/modules/companies/entities/companyLocation.entity";
import { AgreementType } from "../entities/agreementType.entity";
import { OfferDto } from "./offer.dto";

export class FinalOfferDto extends OfferDto {
  company_id: number;
  agreement_types?: AgreementType[];
  locations?: CompanyLocation[];
}