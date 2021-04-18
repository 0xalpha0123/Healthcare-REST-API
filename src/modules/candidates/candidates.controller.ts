import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { CandidateDto } from 'dist/modules/candidates/dto/candidate.dto';
import { CandidatesService } from './candidates.service';
import { Candidate } from './entities/candidate.entity';


@Controller('candidates')
export class CandidatesController {
  constructor(
    private candidatesService: CandidatesService,
  ) { }

  @Get()
  @HttpCode(200)
  findAll() {
    return this.candidatesService.findAll();
  }

  @Post()
  @HttpCode(201)
  create(@Body(ValidationPipe) data: CandidateDto,): Promise<Candidate> {
    return this.candidatesService.create(data);
  }

}
