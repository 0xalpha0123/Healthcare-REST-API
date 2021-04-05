import { IsArray, IsNumber, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class LocationDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  coordinates: string;

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
