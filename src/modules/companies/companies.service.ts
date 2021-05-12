import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Repository } from 'typeorm';
import {
  CompanyWithUserDto,
  LocationWithUserDto,
  PhotoDto,
} from './dto/company.dto';
import { CompanyPhoto } from './entities/companyPhoto.entity';
import { CompanyLocationRepository } from './repositories/companyLocation.repository';
import { CompanyLocation } from './entities/companyLocation.entity';
import { CompanyRepository } from './repositories/company.repository';
import { User } from '../auth/user.entity';
import { UserWithCompanyError } from './errors/userWithCompany.error';
import { UserWithoutCompanyError } from './errors/userWithoutCompany.error';
import { CompanyFilterDto } from './dto/company-filter.dto';
import { LocationNotAssignedToCompanyError } from './errors/locationNotAssignedToCompany.error';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(CompanyRepository)
    private companyRepository: CompanyRepository,
    @InjectRepository(CompanyPhoto)
    private companyPhotoRepository: Repository<CompanyPhoto>,
    @InjectRepository(CompanyLocationRepository)
    private companyLocationRepository: CompanyLocationRepository,
  ) {}

  findAll(filterDto: CompanyFilterDto): Promise<Company[]> {
    const { city, name } = filterDto;
    return this.companyRepository
      .createQueryBuilder('company')
      .innerJoin('company.locations', 'locationsCondition')
      .andWhere('company.name like :name', { name: `%${name || ''}%` })
      .andWhere('locationsCondition.city like :city', {
        city: `%${city || ''}%`,
      })
      .leftJoinAndSelect('company.photos', 'photos')
      .leftJoinAndSelect('company.locations', 'locations')
      .getMany();
  }

  findOne(id: number): Promise<Company> {
    return this.companyRepository.findOne(id, {
      relations: [
        'locations',
        'offers',
        'offers.locations',
        'offers.agreement_types',
        'offers.profession',
        'offers.specialization',
        'photos',
      ],
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
      throw new UserWithCompanyError();
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

  async createLocation(data: LocationWithUserDto) {
    const company = await this.findByUserId(data.user_id);
    if (!company) {
      throw new UserWithoutCompanyError();
    }
    delete data.user_id;
    return this.companyLocationRepository
      .create({ ...data, company_id: company.id })
      .save();
  }

  async deleteLocation(id: number, user: User) {
    const company = await this.findByUserId(user.id);
    const location = await this.companyLocationRepository.findOne(id);
    if (company.id !== location.company_id) {
      throw new LocationNotAssignedToCompanyError();
    }

    return this.companyLocationRepository.delete(id);
  }
}
