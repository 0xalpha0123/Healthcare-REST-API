import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OffersController } from './offers.controller';
import { Offer } from './entities/offer.entity';
import { OffersService } from './offers.service';
import { AuthModule } from '../auth/auth.module';
import { AgreementType } from './entities/agreementType.entity';
import { Profession } from './entities/profession.entity';
import { Specialization } from './entities/specialization.entity';
import { CompaniesModule } from '../companies/companies.module';
import { CompanyLocation } from 'src/modules/companies/entities/companyLocation.entity';

@Module({
  imports: [
    AuthModule,
    CompaniesModule,
    TypeOrmModule.forFeature([
      Offer,
      AgreementType,
      Profession,
      Specialization,
      CompanyLocation
    ]),
  ],
  providers: [OffersService],
  controllers: [OffersController],
  exports: [],
})
export class OffersModule {}
