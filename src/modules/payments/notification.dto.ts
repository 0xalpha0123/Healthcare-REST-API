import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class NotificationDto {
  @ApiProperty()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  tr_status: string;

  @ApiProperty()
  @IsNotEmpty()
  tr_error: string;

  @ApiProperty()
  @IsNotEmpty()
  tr_crc: string;

  @ApiProperty()
  @IsNotEmpty()
  tr_paid: number;

  @ApiProperty()
  @IsNotEmpty()
  md5sum: string;
}
