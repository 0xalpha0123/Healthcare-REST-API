import { EntityRepository, Repository } from 'typeorm';
import { Company } from './entities/company.entity';

@EntityRepository(Company)
export class CompaniesRepository extends Repository<Company> {
  async findById(id: number): Promise<Company> {
    return this.createQueryBuilder('company')
      .leftJoinAndSelect('company.offers', 'offers')
      .leftJoinAndSelect('company.locations', 'companyLocations')
      .leftJoinAndSelect('company.photos', 'photos')
      .leftJoinAndSelect('offers.locations', 'offersLocations')
      .leftJoinAndSelect('offers.profession', 'profession')
      .leftJoinAndSelect('offers.specialization', 'specialization')
      .where({
        id,
      })
      .getOne();
  }
}
