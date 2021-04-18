import { IsOptional, IsUrl } from "class-validator";

export class CandidateDto {

    first_name: string;

    last_name: string;

    @IsOptional()
    message: string;

    @IsUrl()
    cv_file_path: string;

    offer_id: number;
}
