import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Repository } from 'typeorm';
import { CompanyWithUserDto, LocationWithUserDto, PhotoDto } from './dto/company.dto';
import { CompanyPhoto } from './entities/companyPhoto.entity';
import { CompanyLocation } from './entities/companyLocation.entity';
import { User } from '../auth/user.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectRepository(CompanyPhoto)
    private companyPhotoRepository: Repository<CompanyPhoto>,
    @InjectRepository(CompanyLocation)
    private companyLocationRepository: Repository<CompanyLocation>,
  ) { }

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

  async createLocation(data: LocationWithUserDto) {
    const company = await this.findByUserId(data.user_id);
     if (!company) {
      throw new BadRequestException('User do not have company');
    }
    delete data.user_id;
    return this.companyLocationRepository.create({...data, company_id: company.id}).save();
  }

  async deleteLocation(id: number, user: User) {
    const company = await this.findByUserId(user.id);
    const location = await this.companyLocationRepository.findOne(id);
    if (company.id !== location.company_id) {
      throw new BadRequestException('User cannot delete location of other company');
    }

    return this.companyLocationRepository.delete(id);
  }
}
