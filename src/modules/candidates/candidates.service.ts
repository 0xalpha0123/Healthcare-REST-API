import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CandidateDto } from 'src/modules/candidates/dto/candidate.dto';
import { In, Repository } from 'typeorm';
import { User } from '../auth/user.entity';
import { CompaniesService } from '../companies/companies.service';
import { CandidateFilterDto } from './dto/candidate-filter.dto';
import { Candidate } from './entities/candidate.entity';

@Injectable()
export class CandidatesService {
  constructor(
    @InjectRepository(Candidate)
    private candidateRepository: Repository<Candidate>,
    private companiesService: CompaniesService,
  ) { }

  async findAll(filterDto: CandidateFilterDto, user: User): Promise<Candidate[]> {
    const company = await this.companiesService.findByUserId(user.id);

    if (!company) {
      throw new BadRequestException('User have to create company first');
    }
    const offerIds: number[] = company.offers.map(el => el.id);
    const params = (() => {
      if (filterDto.offer_id) {
        if (!offerIds.includes(+filterDto.offer_id)) {
          throw new BadRequestException(`Filtering by offer which not belong to user's company is not allowed`);
        }
        return { offer_id: filterDto.offer_id }
      }
      return { offer_id: In(offerIds) }
    })();
    return await this.candidateRepository.find(params);
  }

  async create(data: CandidateDto): Promise<Candidate> {
    return await this.candidateRepository.create(data).save();
  }
}
