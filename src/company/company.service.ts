import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entity/company.entity';
import { Repository } from 'typeorm';
import {
  CreateCompanyDto,
  CreateCompanyWithUserDto,
} from './dto/createCompany.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  findAll(): Promise<Company[]> {
    return this.companyRepository.find({
      relations: ['photos', 'locations'],
    });
  }

  findOne(id: number): Promise<Company> {
    return this.companyRepository.findOne(
      { id },
      {
        relations: ['photos', 'locations'],
      },
    );
  }

  findByUserId(userId): Promise<Company> {
    return this.companyRepository.findOne({
      user_id: userId,
    });
  }

  async create(data: CreateCompanyWithUserDto): Promise<Company> {
    let company = await this.findByUserId(data.user_id);

    if (company) {
      throw new BadRequestException('User already have company');
    }

    company = Company.create(data);

    return company.save();
  }

  async updateById(userId: number, data: CreateCompanyDto) {
    const company = await this.findByUserId(userId);

    if (!company) {
      throw new BadRequestException('User do not have company');
    }

    const updatedCompany = Object.assign(company, data);

    await updatedCompany.save();
  }
}
