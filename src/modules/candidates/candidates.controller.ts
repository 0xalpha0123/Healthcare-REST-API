import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { CandidateDto } from 'src/modules/candidates/dto/candidate.dto';
import { GetAuthorizedUser } from 'src/common/decorators/getAuthorizedUser.decorator';
import { CandidatesService } from './candidates.service';
import { CandidateFilterDto } from './dto/candidate-filter.dto';
import { Candidate } from './entities/candidate.entity';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { File } from '../../common/interfaces/file.interface';
import { S3ManagerService } from '../../common/services/s3-manager.service';


@Controller('candidates')
export class CandidatesController {
  constructor(
    private candidatesService: CandidatesService,
    private s3ManagerService: S3ManagerService,
  ) { }

  @UseGuards(AuthGuard())
  @Get()
  @HttpCode(200)
  findAll(@Query(ValidationPipe) filterDto: CandidateFilterDto, @GetAuthorizedUser() user: User) {
    return this.candidatesService.findAll(filterDto, user);
  }

  @Post()
  @HttpCode(201)
  create(@Body(ValidationPipe) data: CandidateDto,): Promise<Candidate> {
    return this.candidatesService.create(data);
  }


  @Post('upload-cv')
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('file'))
  async createCV(
    @UploadedFile() file: File,
  ) {

    if (file.mimetype !== "application/pdf") {
      throw new BadRequestException("File must have .pdf extension")
    }
    const upload = await this.s3ManagerService
      .uploadFile('cvs', file)
      .catch(() => {
        throw new BadRequestException(
          'There was problem during uploading file',
        );
      });


    return { file_path: upload.Location };
  }

}
