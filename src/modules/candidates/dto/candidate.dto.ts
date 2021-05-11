import { IsOptional, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CandidateDto {

    @ApiProperty()
    first_name: string;

    @ApiProperty()
    last_name: string;

    @ApiProperty()
    @IsOptional()
    message: string;

    @ApiProperty()
    @IsUrl({
        allow_trailing_dot: true
    })
    cv_file_path: string;

    @ApiProperty()
    offer_id: number;
}
