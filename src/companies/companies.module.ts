import { Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { CompaniesService } from './companies.service';
import { CompanyPhoto } from './entities/companyPhoto.entity';
import { CompanyLocation } from './entities/companyLocation.entity';
import { AuthModule } from '../auth/auth.module';
import { S3ManagerModule } from '../s3manager/s3-manager.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Company, CompanyPhoto, CompanyLocation]),
    S3ManagerModule,
  ],
  providers: [CompaniesService],
  controllers: [CompaniesController],
  exports: [],
})
export class CompaniesModule {}
