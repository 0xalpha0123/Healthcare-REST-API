import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3ManagerService } from 'src/common/services/s3-manager.service';
import { AuthModule } from '../auth/auth.module';
import { CompaniesModule } from '../companies/companies.module';
import { CandidatesController } from './candidates.controller';
import { CandidatesService } from './candidates.service';
import { Candidate } from './entities/candidate.entity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Candidate]), CompaniesModule],
  providers: [CandidatesService, S3ManagerService],
  controllers: [CandidatesController],
  exports: [],
})
export class CandidatesModule {}
