import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OfferFilterDto } from './dto/offer-filter.dto';
import { OfferDto } from './dto/offer.dto';
import { SpecializationFilterDto } from './dto/specialization-filter.dto';
import { AgreementType } from './entities/agreementType.entity';
import { Offer } from './entities/offer.entity';
import { Profession } from './entities/profession.entity';
import { Specialization } from './entities/specialization.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    @InjectRepository(Profession)
    private professionRepository: Repository<Profession>,
    @InjectRepository(Specialization)
    private specializationRepository: Repository<Specialization>,
    @InjectRepository(AgreementType)
    private agreementTypeRepository: Repository<AgreementType>,
  ) {}

  async findAll(filterDto: OfferFilterDto): Promise<Offer[]> {
    return await this.offerRepository.find(filterDto);
  }

  async findOne(id: number): Promise<Offer> {
    const foundOffer = await this.offerRepository.findOne(id);
    if (!foundOffer) {
      throw new NotFoundException(`Offer with ID "${id}" not found`);
    }

    return foundOffer;
  }

  async create(data: OfferDto): Promise<Offer> {
    return await this.offerRepository.create(data).save();
  }

  async update(id: number, data: OfferDto): Promise<void> {
    await this.offerRepository.update(id, data);
  }

  async findAllProfessions(): Promise<Profession[]> {
    return await this.professionRepository.find();
  }

  async findAllSpecializations(filterDto: SpecializationFilterDto): Promise<Specialization[]> {
    return await this.specializationRepository.find(filterDto);
  }

  async findAllAgreementTypes(): Promise<AgreementType[]> {
    return await this.agreementTypeRepository.find();
  }
}
