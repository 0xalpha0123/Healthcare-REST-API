import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OfferDto } from './dto/offer.dto';
import { Offer } from './entities/offer.entity';
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
  @HttpCode(201)
  @Post()
  create(@Body() data: OfferDto): Promise<Offer> {
    return this.offersService.create(data);
  }

  @UseGuards(AuthGuard())
  @HttpCode(201)
  @Put()
  update(): string {
    return this.offersService.update();
  }
}
