import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { CompaniesModule } from '../companies/companies.module';
import { S3ManagerModule } from '../s3manager/s3-manager.module';
import { CandidatesController } from './candidates.controller';
import { CandidatesService } from './candidates.service';
import { Candidate } from './entities/candidate.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Candidate]),
    S3ManagerModule,
    CompaniesModule
  ],
  providers: [CandidatesService],
  controllers: [CandidatesController],
  exports: [],
})
export class CandidatesModule { }
