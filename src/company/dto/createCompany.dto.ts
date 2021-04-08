import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Coordinates } from '../../common/interfaces/coordinates.interface';

export class PhotoDto {
  @IsString()
  name: string;

  @IsString()
  file_path: string;

  @IsNumber()
  company_id: number;
}

export class LocationDto {
  @IsNumber()
  @IsOptional()
  id?: number;

  @IsString()
  @IsOptional()
  name?: string;

  @IsNotEmpty()
  coordinates: Coordinates;

  @IsString()
  city: string;

  @IsString()
  postcode: string;

  @IsString()
  street: string;

  @IsNumber()
  building_number: number;

  @IsNumber()
  @IsOptional()
  room_number?: number;
}

export class CreateCompanyDto {
  @IsNumber()
  @IsOptional()
  id?: number;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  description: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  website_url: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LocationDto)
  locations: LocationDto[];
}

export class CreateCompanyWithUserDto extends CreateCompanyDto {
  @IsNumber()
  user_id: number;
}
