import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  // Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OfferDto } from './dto/offer.dto';
import { AgreementType } from './entities/agreement_type.entity';
import { Offer } from './entities/offer.entity';
import { Profession } from './entities/profession.entity';
import { Specialization } from './entities/specialization.entity';
import { OffersService } from './offers.service';

@Controller('offers')
export class OffersController {
  constructor(private offersService: OffersService) {}

  @Get()
  @HttpCode(200)
  findAll(): Promise<Offer[]> {
    return this.offersService.findAll();
  }

  @Get(':id')
  @HttpCode(200)
  findOne(@Param() { id }): Promise<Offer> {
    return this.offersService.findOne(id);
  }

  @UseGuards(AuthGuard())
  @Post()
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  create(@Body() data: OfferDto): Promise<Offer> {
    return this.offersService.create(data);
  }

  @UseGuards(AuthGuard())
  @Put()
  @HttpCode(201)
  update(@Body() { id }): Promise<Offer> {
    return this.offersService.update(id);
  }

  @UseGuards(AuthGuard())
  @Get('professions')
  @HttpCode(200)
  findAllProfessions(): Promise<Profession[]> {
    return this.offersService.findAllProfessions();
  }

  @UseGuards(AuthGuard())
  @Get('specializations')
  @HttpCode(200)
  findAllSpecializations(): Promise<Specialization[]> {
    return this.offersService.findAllSpecializations();
  }

  @UseGuards(AuthGuard())
  @Get('agreement-types')
  @HttpCode(200)
  findAllAgreementTypes(): Promise<AgreementType[]> {
    return this.offersService.findAllAgreementTypes();
  }
}
