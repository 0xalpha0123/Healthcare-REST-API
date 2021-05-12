import { IsOptional, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CandidateDto {
  @ApiProperty({
    example: 'candidate first name',
  })
  first_name: string;

  @ApiProperty({
    example: 'candidate last name',
  })
  last_name: string;

  @ApiProperty({
    example: 'message',
  })
  @IsOptional()
  message: string;

  @ApiProperty({
    example: 'cv path',
  })
  @IsUrl({
    allow_trailing_dot: true,
  })
  cv_file_path: string;

  @ApiProperty({
    example: 1,
  })
  offer_id: number;
}
