import { EntityRepository, Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { OfferFilterDto } from './dto/offer-filter.dto';

const orderByParams = {
  latest: ['offer.created_at', 'DESC'],
  salaryMax: ['offer.salary_to', 'DESC'],
  salaryMin: ['offer.salary_from', 'ASC'],
};

@EntityRepository(Offer)
export class OffersRepository extends Repository<Offer> {
  async findByQuery(filterDto: OfferFilterDto): Promise<Offer[]> {

    const { title, city, salary_from: salaryFrom, salary_to: salaryTo, order = 'latest', ...restFilters } = filterDto;

    const orderParam = orderByParams[order];

    return this.createQueryBuilder('offer')
      .leftJoinAndSelect('offer.company', 'company')
      .leftJoinAndSelect('company.locations', 'location')
      .leftJoinAndSelect('offer.specialization', 'specialization')
      .leftJoinAndSelect('offer.profession', 'profession')
      .where({
        ...restFilters,
        active: true,
      })
      .andWhere('offer.title like :title', { title: `%${title || ''}%` })
      .andWhere('location.city like :city', { city: `%${city || ''}%` })
      .andWhere('offer.paid_till > :now', { now: new Date().toISOString() })
      .andWhere('offer.salary_to <= :salaryTo', { salaryTo })
      .andWhere('offer.salary_from >= :salaryFrom', { salaryFrom })
      .orderBy(orderParam[0], orderParam[1])
      .getMany();
  }
}