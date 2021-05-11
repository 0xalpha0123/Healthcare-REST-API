import { ConnectionOptions } from 'typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Company } from '../modules/companies/entities/company.entity';
import { CompanyPhoto } from '../modules/companies/entities/companyPhoto.entity';
import { CompanyLocation } from '../modules/companies/entities/companyLocation.entity';
import { User } from '../modules/auth/user.entity';
import { Offer } from '../modules/offers/entities/offer.entity';
import { AgreementType } from '../modules/offers/entities/agreementType.entity';
import { Candidate } from '../modules/candidates/entities/candidate.entity';
import { Payment } from '../modules/payments/payment.entity';
import { Profession } from '../modules/offers/entities/profession.entity';
import { Specialization } from '../modules/offers/entities/specialization.entity';
import { CandidateDto } from '../modules/candidates/dto/candidate.dto';
import { LocationDto } from '../modules/companies/dto/company.dto';
import PaymentStatus from '../modules/payments/paymentStatus.enum';
import { Observable } from 'rxjs';

export const mockedMailGunConfig = {
  apiKey: 'apikey',
  domain: 'domain',
}

export const mockedTpayConfig = {
  url: 'url',
  id: 55,
  api_password: 'api_password',
  api_key: 'api_key',
  security_code: 'security_code',
  result_url: 'result_url',
  result_email: 'result_email',
  return_url: 'return_url',
  return_error_url: 'return_error_url',
};

export const mockedConfigService = {
  get(key: string) {
    switch (key) {
      case 'mailgun':
        return mockedMailGunConfig;
      case 'tpay':
        return mockedTpayConfig;
    }
  },
};

export const mockedS3Service = {
  async uploadFile() {
    return {
      Location: 'file location',
    };
  },

  async removeFile() {
    return true;
  },
};

export const mockedMailService = {
  async sendMail() {
    return true;
  },
};

export const mockedHttpServiceForPayments = {
  post() {
    return new Observable((obs) => {
      obs.next({
        data: {
          title: 'title',
          url: 'url',
        },
      });
      obs.complete();
    });
  },
};

export const dateAfter2Days = () => {
  const now = new Date();
  now.setDate(now.getDate() + 2);
  return now;
};

export const mockedDb: ConnectionOptions | TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5555,
  username: 'test-user-nest',
  password: 'test-password-nest',
  database: 'test-database-nest',
  synchronize: true,
  entities: [
    Company,
    CompanyPhoto,
    CompanyLocation,
    User,
    Offer,
    AgreementType,
    Candidate,
    Payment,
    Profession,
    Specialization,
  ],
  migrations: ['dist/migrations/**/*{.ts,.js}'],
  cli: { migrationsDir: 'src/migrations' },
  dropSchema: true,
};

export const userCredentialsDto = {
  email: 'email@gmail.com',
  password: 'testingPassword123!',
  salt: 'salt',
  verification_token: 'ver-token',
  active: false,
};

export const companyDataDto = {
  name: 'test',
  description: 'desc',
  logo_file_path: 'logo_path',
  website_url: 'web_url',
  locations: [],
  offers: [],
  photos: [],
};

export const fileDto = {
  buffer: Buffer.from('buffer'),
  originalname: 'fileName',
  mimetype: 'txt',
};

export const cvDto = {
  buffer: Buffer.from('buffer'),
  originalname: 'fileName',
  mimetype: 'application/pdf',
};

export const locationDto = (companyId: number): LocationDto => ({
  coordinates: { x: 123, y: 123 },
  city: 'city',
  postcode: 'postcode',
  street: 'street',
  building_number: 55,
  company_id: companyId,
});

export const candidateDto = (offerId: number): CandidateDto => ({
  first_name: 'name',
  last_name: 'last',
  message: 'message',
  cv_file_path: 'cv_path',
  offer_id: offerId,
});

export const agreementTypeDto = {
  name: 'TestAgg',
};

export const professionDto = {
  name: 'TestProf',
  icon_path: 'icon_path',
};

export const specializationDto = (professionId: number) => ({
  name: 'TestSpec',
  profession_id: professionId,
  is_promoted: false,
  icon_path: 'icon_path',
});

export const offerDto = ({
  companyId,
  agreementType,
  specialization,
  profession,
  companyLocation,
}) => ({
  title: 'title',
  description: 'description',
  salary_from: 1000,
  salary_to: 1000,
  active: true,
  agreement_type_id: agreementType.id,
  specialization_id: specialization.id,
  profession_id: profession.id,
  company_id: companyId,
  agreement_type_ids: [agreementType.id],
  company_location_ids: [companyLocation.id],
  locations: [companyLocation],
  paid_till: dateAfter2Days(),
});

export const paymentDto = (offerId: number, crc = 'crc') => ({
  title: 'title',
  crc,
  amount: 123,
  extension_days: 5,
  offer_id: offerId,
  status: PaymentStatus.IN_PROGRESS,
});

export const transactionDto = ({ offer_id, amount, bank_id, extension_days }) => ({
  offer_id,
  amount,
  bank_id,
  extension_days,
});

export const notifcationDto = ({
  id,
  tr_status,
  tr_error,
  tr_crc,
  tr_paid,
  md5sum,
}) => ({
  id,
  tr_status,
  tr_error,
  tr_crc,
  tr_paid,
  md5sum,
});
