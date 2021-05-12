import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OffersController } from './offers.controller';
import { OffersService } from './offers.service';
import { AuthModule } from '../auth/auth.module';
import { AgreementType } from './entities/agreementType.entity';
import { Profession } from './entities/profession.entity';
import { Specialization } from './entities/specialization.entity';
import { CompaniesModule } from '../companies/companies.module';
import { CompanyLocation } from 'src/modules/companies/entities/companyLocation.entity';
import { OffersRepository } from './offers.repository';

@Module({
  imports: [
    AuthModule,
    CompaniesModule,
    TypeOrmModule.forFeature([
      OffersRepository,
      AgreementType,
      Profession,
      Specialization,
      CompanyLocation,
    ]),
  ],
  providers: [OffersService],
  controllers: [OffersController],
  exports: [],
})
export class OffersModule {}
