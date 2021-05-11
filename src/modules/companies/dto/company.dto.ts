import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Coordinates } from '../../../common/interfaces/coordinates.interface';
import { ApiProperty } from '@nestjs/swagger';

export class PhotoDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  file_path: string;

  @ApiProperty()
  @IsNumber()
  company_id: number;
}

export class LocationDto {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  id?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsNotEmpty()
  coordinates: Coordinates;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsString()
  postcode: string;

  @ApiProperty()
  @IsString()
  street: string;

  @ApiProperty()
  @IsNumber()
  building_number: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  room_number?: number;

  company_id: number;
}

export class CompanyDto {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  id?: number;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @MaxLength(255)
  website_url: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @MaxLength(255)
  logo_file_path: string;
}

export class CompanyWithUserDto extends CompanyDto {
  @IsNumber()
  user_id: number;
}

export class LocationWithUserDto extends LocationDto {
  @ApiProperty()
  @IsNumber()
  user_id: number;
}
