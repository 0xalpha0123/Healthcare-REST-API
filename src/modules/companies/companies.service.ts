import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Repository } from 'typeorm';
import { CompanyWithUserDto, PhotoDto } from './dto/company.dto';
import { CompanyPhoto } from './entities/companyPhoto.entity';
import { CompanyLocationRepository } from './repositories/companyLocation.repository';
import { CompanyLocation } from './entities/companyLocation.entity';
import { CompaniesRepository } from './companies.repository';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(CompaniesRepository)
    private companyRepository: CompaniesRepository,
    @InjectRepository(CompanyPhoto)
    private companyPhotoRepository: Repository<CompanyPhoto>,
    @InjectRepository(CompanyLocationRepository)
    private companyLocationRepository: CompanyLocationRepository,
  ) { }

  findAll(): Promise<Company[]> {
    return this.companyRepository.find({
      relations: ['photos', 'locations'],
    });
  }

  findOne(id: number): Promise<Company> {
    return this.companyRepository.findById(id);
  }

  findByUserId(userId): Promise<Company> {
    return this.companyRepository.findOne(
      {
        user_id: userId,
      },
      {
        relations: ['photos', 'locations', 'offers'],
      },
    );
  }

  async create(data: CompanyWithUserDto): Promise<Company> {
    const company = await this.findByUserId(data.user_id);

    if (company) {
      throw new BadRequestException('User already have company');
    }

    return this.companyRepository.create(data).save();
  }

  async update(data: CompanyWithUserDto) {
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

  findUniqueLocations(): Promise<CompanyLocation[]> {
    return this.companyLocationRepository.findUniqueLocations();
  }
}
