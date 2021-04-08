import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entity/company.entity';
import { Repository } from 'typeorm';
import { CreateCompanyWithUserDto, PhotoDto } from './dto/createCompany.dto';
import { CompanyPhoto } from './entity/companyPhoto.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectRepository(CompanyPhoto)
    private companyPhotoRepository: Repository<CompanyPhoto>,
  ) {}

  findAll(): Promise<Company[]> {
    return this.companyRepository.find({
      relations: ['photos', 'locations'],
    });
  }

  findOne(id: number): Promise<Company> {
    return this.companyRepository.findOne(id, {
      relations: ['photos', 'locations'],
    });
  }

  findByUserId(userId): Promise<Company> {
    return this.companyRepository.findOne(
      {
        user_id: userId,
      },
      {
        relations: ['photos', 'locations'],
      },
    );
  }

  async create(data: CreateCompanyWithUserDto): Promise<Company> {
    const company = await this.findByUserId(data.user_id);

    if (company) {
      throw new BadRequestException('User already have company');
    }

    return this.companyRepository.create(data).save();
  }

  async update(data: CreateCompanyWithUserDto) {
    const company = await this.findByUserId(data.user_id);

    if (!company) {
      throw new BadRequestException('User do not have company');
    }

    const updatedCompany = await this.companyRepository.preload(data);

    await this.companyRepository.save(updatedCompany);
  }

  findOnePhoto(id, companyId): Promise<CompanyPhoto> {
    return this.companyPhotoRepository.findOne({ id, company_id: companyId });
  }

  createPhoto(data: PhotoDto): Promise<CompanyPhoto> {
    return this.companyPhotoRepository.create(data).save();
  }

  deletePhoto(id: number) {
    return this.companyPhotoRepository.delete(id);
  }
}
