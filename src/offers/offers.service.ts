import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OfferDto } from './dto/offer.dto';
import { Offer } from './entities/offer.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
  ) {}

  findAll(): Promise<Offer[]> {
    return this.offerRepository.find();
  }

  async findOne(id: number): Promise<Offer> {
    const foundOffer = await this.offerRepository.findOne(id);
    if (!foundOffer) {
      throw new NotFoundException(`Offer with ID "${id}" not found`);
    }

    return foundOffer;
  }

  create(data: OfferDto): Promise<Offer> {
    return this.offerRepository.create(data).save();
  }

  async update(id: number): Promise<Offer> {
    const offer = await this.findOne(id);
    return offer;
  }
}
