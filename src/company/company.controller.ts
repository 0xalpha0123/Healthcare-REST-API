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
import { Company } from './entity/company.entity';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/createCompany.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetAuthorizedUser } from '../common/decorators/getAuthorizedUser.decorator';
import { User } from '../auth/user.entity';

@Controller('company')
export class CompanyController {
  constructor(private companyService: CompanyService) {}

  @Get()
  @HttpCode(200)
  findAll(): Promise<Company[]> {
    return this.companyService.findAll();
  }

  @Get(':id')
  @HttpCode(200)
  findOne(@Param() { id }): Promise<Company> {
    return this.companyService.findOne(id);
  }

  @UseGuards(AuthGuard())
  @Post()
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(
    @Body() data: CreateCompanyDto,
    @GetAuthorizedUser() user: User,
  ): Promise<Company> {
    return this.companyService.create({
      ...data,
      user_id: user.id,
    });
  }

  @UseGuards(AuthGuard())
  @Put()
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  update(@Body() data: CreateCompanyDto, @GetAuthorizedUser() user: User) {
    return this.companyService.update({
      ...data,
      user_id: user.id,
    });
  }
}
