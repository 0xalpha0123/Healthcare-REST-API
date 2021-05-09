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

export const mockedConfigService = {
  get(key: string) {
    switch (key) {
      case 'mailgun':
        return {
          apiKey: 'apikey',
          domain: 'domain',
        };
    }
  },
};

export const mockedS3Service = {

}

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
}