import { Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesService } from './companies.service';
import { CompanyPhoto } from './entities/companyPhoto.entity';
import { AuthModule } from '../auth/auth.module';
import { S3ManagerService } from 'src/common/services/s3-manager.service';
import { CompanyLocationRepository } from './repositories/companyLocation.repository';
import { CompanyRepository } from './repositories/company.repository';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      CompanyPhoto,
      CompanyLocationRepository,
      CompanyRepository,
    ]),
  ],
  providers: [CompaniesService, S3ManagerService],
  controllers: [CompaniesController],
  exports: [CompaniesService],
})
export class CompaniesModule {}
