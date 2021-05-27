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
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetAuthorizedUser } from '../../common/decorators/getAuthorizedUser.decorator';
import { User } from '../auth/user.entity';
import { OfferFilterDto } from './dto/offer-filter.dto';
import { OfferDto, OfferParamsDto } from './dto/offer.dto';
import { SpecializationFilterDto } from './dto/specialization-filter.dto';
import { AgreementType } from './entities/agreementType.entity';
import { Offer } from './entities/offer.entity';
import { Profession } from './entities/profession.entity';
import { Specialization } from './entities/specialization.entity';
import { OffersService } from './offers.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('offers')
@Controller('offers')
export class OffersController {
  constructor(private offersService: OffersService) {}

  @Get('agreement-types')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'The agreement types has been successfully fetched.',
  })
  @ApiResponse({
    status: 400,
    description: 'There are no agreement types.',
  })
  findAllAgreementTypes(): Promise<AgreementType[]> {
    return this.offersService.findAllAgreementTypes();
  }

  @Get('professions')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'The professions has been successfully fetched.',
  })
  @ApiResponse({
    status: 400,
    description: 'There are no professions.',
  })
  findAllProfessions(): Promise<Profession[]> {
    return this.offersService.findAllProfessions();
  }

  @Get('specializations')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'The specializations has been successfully fetched.',
  })
  @ApiResponse({
    status: 400,
    description: 'There are no specializations.',
  })
  findAllSpecializations(
    @Query(ValidationPipe) filterDto: SpecializationFilterDto,
  ): Promise<Specialization[]> {
    return this.offersService.findAllSpecializations(filterDto);
  }

  @Get()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'The offers has been successfully fetched.',
  })
  @ApiResponse({
    status: 400,
    description: 'There are no offers.',
  })
  findAll(@Query(ValidationPipe) filterDto: OfferFilterDto): Promise<Offer[]> {
    return this.offersService.findAll(filterDto);
  }

  @Get(':id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'The offer has been successfully fetched for given id.',
  })
  @ApiResponse({
    status: 400,
    description: 'There are no offer for given id.',
  })
  findOne(@Param() params: OfferParamsDto): Promise<Offer> {
    return this.offersService.findOne(params.id);
  }

  @UseGuards(AuthGuard())
  @Post()
  @HttpCode(201)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The offer has been successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'User do not have company',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  create(
    @Body(ValidationPipe) data: OfferDto,
    @GetAuthorizedUser() user: User,
  ): Promise<Offer> {
    return this.offersService.create(data, user);
  }

  @UseGuards(AuthGuard())
  @Put(':id')
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiResponse({
    status: 204,
    description: 'The offer has been successfully updated.',
  })
  @ApiResponse({
    status: 400,
    description: 'User do not have company',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  update(
    @Param() params: OfferParamsDto,
    @Body() data: OfferDto,
    @GetAuthorizedUser() user: User,
  ): Promise<Offer> {
    return this.offersService.update(params.id, data, user);
  }
}
