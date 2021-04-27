import { EntityRepository, Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { OfferFilterDto } from './dto/offer-filter.dto';

@EntityRepository(Offer)
export class OffersRepository extends Repository<Offer> {
  async findByQuery(filterDto: OfferFilterDto): Promise<Offer[]> {

    const { title, city, salary_from: salaryFrom, salary_to: salaryTo, ...restFilters } = filterDto;
    console.log(restFilters);

    return this.createQueryBuilder('offer')
      .leftJoinAndSelect('offer.company', 'company')
      .leftJoinAndSelect('company.locations', 'location')
      .where({
        ...restFilters,
        active: true,
      })
      .andWhere('offer.title like :title', { title: `%${title || ''}%` })
      .andWhere('location.city like :city', { city: `%${city || ''}%` })
      .andWhere('offer.paid_till > :now', { now: new Date().toISOString() })
      .andWhere('offer.salary_to <= :salaryTo', { salaryTo })
      .andWhere('offer.salary_from >= :salaryFrom', { salaryFrom })
      .getMany();
  }
}