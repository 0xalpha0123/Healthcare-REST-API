import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OfferDto } from './dto/offer.dto';
import { AgreementType } from './entities/agreementType.entity';
import { Offer } from './entities/offer.entity';
import { Profession } from './entities/profession.entity';
import { Specialization } from './entities/specialization.entity';
import { OffersService } from './offers.service';

@Controller('offers')
export class OffersController {
  constructor(private offersService: OffersService) {}

  @UseGuards(AuthGuard())
  @Get('agreement-types')
  @HttpCode(200)
  findAllAgreementTypes(): Promise<AgreementType[]> {
    return this.offersService.findAllAgreementTypes();
  }

  @UseGuards(AuthGuard())
  @Get('professions')
  @HttpCode(200)
  findAllProfessions(): Promise<Profession[]> {
    return this.offersService.findAllProfessions();
  }

  @UseGuards(AuthGuard())
  @Get('specializations/:id')
  @HttpCode(200)
  findAllSpecializations(
    @Param() professionId: number,
  ): Promise<Specialization[]> {
    return this.offersService.findAllSpecializations(professionId);
  }

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
  @Put(':id')
  @HttpCode(204)
  update(@Param() id: number, @Body() data: OfferDto): Promise<void> {
    return this.offersService.update(id, data);
  }
}
