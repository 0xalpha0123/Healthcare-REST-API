import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Coordinates } from '../../../common/interfaces/coordinates.interface';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

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

  company_id: number;
}

export class CompanyDto {
  @ApiProperty({
    example: 'company name',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'company description',
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    example: 'company website url',
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  website_url: string;

  @ApiHideProperty()
  @IsString()
  @IsOptional()
  @MaxLength(255)
  logo_file_path?: string;
}

export class CompanyWithUserDto extends CompanyDto {
  @IsNumber()
  user_id: number;
}

export class LocationWithUserDto extends LocationDto {
  @IsNumber()
  user_id: number;
}

export class CompanyParamDto {
  id: number;
}

export class CompanyPhotoParamDto {
  id: number;
}

export class CompanyLocationParamDto {
  id: number;
}
