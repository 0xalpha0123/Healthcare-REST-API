import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CandidateDto } from 'dist/modules/candidates/dto/candidate.dto';
import { Repository } from 'typeorm';
import { Candidate } from './entities/candidate.entity';

@Injectable()
export class CandidatesService {
  constructor(
    @InjectRepository(Candidate)
    private candidateRepository: Repository<Candidate>,
  ) { }

  async findAll(): Promise<Candidate[]> {
    return await this.candidateRepository.find();
  }

  async create(data: CandidateDto): Promise<Candidate> {
    return await this.candidateRepository.create(data).save();
  }
}
