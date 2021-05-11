import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SpecializationFilterDto {
  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  profession_id: number;
}
