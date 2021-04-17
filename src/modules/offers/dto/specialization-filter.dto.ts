import { IsNotEmpty, IsOptional } from "class-validator";

export class SpecializationFilterDto {
  @IsOptional()
  @IsNotEmpty()
  profession_id: number;
}