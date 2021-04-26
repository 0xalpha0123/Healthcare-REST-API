import { EntityRepository, Repository } from 'typeorm';
import { CompanyLocation } from '../entities/companyLocation.entity';

@EntityRepository(CompanyLocation)
export class CompanyLocationRepository extends Repository<CompanyLocation> {
  async findUniqueLocations(): Promise<CompanyLocation[]> {
    return this.createQueryBuilder('CompanyLocation')
      .select('city')
      .distinct(true)
      .getRawMany();
  }
}