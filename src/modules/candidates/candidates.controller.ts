import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CandidateDto } from 'src/modules/candidates/dto/candidate.dto';
import { GetAuthorizedUser } from 'src/common/decorators/getAuthorizedUser.decorator';
import { CandidatesService } from './candidates.service';
import { CandidateFilterDto } from './dto/candidate-filter.dto';
import { Candidate } from './entities/candidate.entity';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/user.entity';


@Controller('candidates')
export class CandidatesController {
  constructor(
    private candidatesService: CandidatesService,
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

}
