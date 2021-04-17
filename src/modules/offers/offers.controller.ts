import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
  Query
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OfferFilterDto } from './dto/offer-filter.dto';
import { OfferDto } from './dto/offer.dto';
import { SpecializationFilterDto } from './dto/specialization-filter.dto';
import { AgreementType } from './entities/agreementType.entity';
import { Offer } from './entities/offer.entity';
import { Profession } from './entities/profession.entity';
import { Specialization } from './entities/specialization.entity';
import { OffersService } from './offers.service';

@Controller('offers')
export class OffersController {
  constructor(private offersService: OffersService) {}

  @Get('agreement-types')
  @HttpCode(200)
  findAllAgreementTypes(): Promise<AgreementType[]> {
    return this.offersService.findAllAgreementTypes();
  }

  @Get('professions')
  @HttpCode(200)
  findAllProfessions(): Promise<Profession[]> {
    return this.offersService.findAllProfessions();
  }

  @Get('specializations')
  @HttpCode(200)
  findAllSpecializations(
    @Query(ValidationPipe) filterDto: SpecializationFilterDto,
  ): Promise<Specialization[]> {
    return this.offersService.findAllSpecializations(filterDto);
  }

  @Get()
  @HttpCode(200)
  findAll(@Query(ValidationPipe) filterDto: OfferFilterDto): Promise<Offer[]> {
    return this.offersService.findAll(filterDto);
  }

  @Get(':id')
  @HttpCode(200)
  findOne(@Param() { id }): Promise<Offer> {
    return this.offersService.findOne(id);
  }

  // @UseGuards(AuthGuard())
  @Post()
  @HttpCode(201)
  create(@Body(ValidationPipe) data: OfferDto): Promise<Offer> {
    return this.offersService.create(data);
  }

  @UseGuards(AuthGuard())
  @Put(':id')
  @HttpCode(204)
  update(@Param() id: number, @Body() data: OfferDto): Promise<void> {
    return this.offersService.update(id, data);
  }
}
