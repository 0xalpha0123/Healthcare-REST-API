import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Company } from './entities/company.entity';
import { CompaniesService } from './companies.service';
import {
  CompanyDto,
  CompanyLocationParamDto,
  CompanyParamDto,
  CompanyPhotoParamDto,
  LocationWithUserDto,
} from './dto/company.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetAuthorizedUser } from '../../common/decorators/getAuthorizedUser.decorator';
import { User } from '../auth/user.entity';
import { S3ManagerService } from '../../common/services/s3-manager.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { File, FileUploadDto } from '../../common/interfaces/file.interface';
import { CompanyLocation } from './entities/companyLocation.entity';
import { CompanyFilterDto } from './dto/company-filter.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('companies')
@Controller('companies')
export class CompaniesController {
  constructor(
    private companyService: CompaniesService,
    private s3ManagerService: S3ManagerService,
  ) {}

  @Get()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'The companies has been successfully fetched.',
  })
  @ApiResponse({
    status: 404,
    description: 'There are no companies.',
  })
  findAll(
    @Query(ValidationPipe) filterDto: CompanyFilterDto,
  ): Promise<Company[]> {
    return this.companyService.findAll(filterDto);
  }

  @UseGuards(AuthGuard())
  @Get('by-user')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description:
      'The company for authorized user has been successfully fetched',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  findUserCompany(@GetAuthorizedUser() user: User) {
    return this.companyService.findByUserId(user.id);
  }

  @Get('locations')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'The locations has been successfully fetched',
  })
  @ApiResponse({
    status: 404,
    description: 'There are no locations.',
  })
  findUniqueLocations(): Promise<CompanyLocation[]> {
    return this.companyService.findUniqueLocations();
  }

  @Get(':id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'The company has been successfully fetched by given id',
  })
  @ApiResponse({
    status: 404,
    description: 'There are no company for given id.',
  })
  findOne(@Param() params: CompanyParamDto): Promise<Company> {
    return this.companyService.findOne(params.id);
  }

  @UseGuards(AuthGuard())
  @Post()
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'The company has been successfully created.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 400,
    description: 'User already have company',
  })
  create(
    @Body() data: CompanyDto,
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
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The company has been successfully updated.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 400,
    description: 'User do not have company',
  })
  update(@Body() data: CompanyDto, @GetAuthorizedUser() user: User) {
    return this.companyService.update({
      ...data,
      user_id: user.id,
    });
  }

  @UseGuards(AuthGuard())
  @Post('photo')
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'The photo has been successfully uploaded.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 400,
    description: 'User do not have company',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Photo file',
    type: FileUploadDto,
  })
  async createPhoto(
    @UploadedFile() file: File,
    @GetAuthorizedUser() user: User,
  ) {
    const company = await this.companyService.findByUserId(user.id);

    const upload = await this.s3ManagerService
      .uploadFile('photos', file)
      .catch(() => {
        throw new BadRequestException(
          'There was problem during uploading file',
        );
      });

    return this.companyService.createPhoto({
      name: file.originalname,
      file_path: upload.Location,
      company_id: company.id,
    });
  }

  @UseGuards(AuthGuard())
  @Delete('photo/:id')
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiResponse({
    status: 204,
    description: 'The photo has been successfully deleted.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 400,
    description: 'There is no photo with given id',
  })
  async deletePhoto(@Param() params: CompanyPhotoParamDto, @GetAuthorizedUser() user: User) {
    const company = await this.companyService.findByUserId(user.id);
    const photo = await this.companyService.findOnePhoto(params.id, company.id);

    if (!photo) {
      throw new BadRequestException(`There is no photo with given id`);
    }

    await this.s3ManagerService.removeFile(photo.file_path).catch(() => {
      throw new BadRequestException('There was problem during deleting file');
    });

    return this.companyService.deletePhoto(photo.id);
  }

  @UseGuards(AuthGuard())
  @Post('location')
  @HttpCode(201)
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'The location has been successfully created.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 400,
    description: 'User do not have company',
  })
  async createLocation(
    @GetAuthorizedUser() user: User,
    @Body() data: LocationWithUserDto,
  ) {
    return this.companyService.createLocation({ ...data, user_id: user.id });
  }

  @UseGuards(AuthGuard())
  @Delete('location/:id')
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiResponse({
    status: 204,
    description: 'The location has been successfully removed.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 400,
    description: 'User cannot delete location of other company',
  })
  async deleteLocation(
    @GetAuthorizedUser() user: User,
    @Param() params: CompanyLocationParamDto,
  ) {
    return this.companyService.deleteLocation(params.id, user);
  }

  @UseGuards(AuthGuard())
  @Post('upload-logo')
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiResponse({
    status: 204,
    description: 'The logo has been successfully uploaded.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Logo file',
    type: FileUploadDto,
  })
  async uploadLogo(@UploadedFile() file: File) {
    const upload = await this.s3ManagerService
      .uploadFile('logos', file)
      .catch(() => {
        throw new BadRequestException(
          'There was problem during uploading file',
        );
      });

    return { file_path: upload.Location };
  }
}
