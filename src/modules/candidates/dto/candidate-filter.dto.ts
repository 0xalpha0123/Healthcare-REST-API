import { ApiProperty } from '@nestjs/swagger';

export class CandidateFilterDto {
  @ApiProperty()
  offer_id: number;
}
