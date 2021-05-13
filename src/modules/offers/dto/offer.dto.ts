import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OfferDto {
  @ApiProperty({
    example: 'title',
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'description',
  })
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 1000,
  })
  @IsOptional()
  salary_from?: number;

  @ApiProperty({
    example: 5000,
  })
  @IsOptional()
  salary_to?: number;

  @ApiProperty({
    example: [1, 2],
  })
  @IsOptional()
  agreement_type_ids: number[];

  @ApiProperty({
    example: [1, 2],
  })
  @IsOptional()
  company_location_ids: number[];

  @ApiProperty({
    example: 1,
  })
  @IsNotEmpty()
  profession_id: number;

  @ApiProperty({
    example: 1,
  })
  @IsOptional()
  specialization_id: number;

  @ApiProperty({
    example: true,
  })
  @IsNotEmpty()
  active: boolean;
}

export class OfferParamsDto {
  id: number;
}
