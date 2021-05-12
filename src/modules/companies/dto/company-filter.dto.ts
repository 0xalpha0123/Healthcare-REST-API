import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CompanyFilterDto {
  @ApiProperty({
    example: 'name',
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'city',
  })
  @IsString()
  @IsOptional()
  city: string;
}
