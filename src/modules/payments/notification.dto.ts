import { IsNotEmpty } from 'class-validator';

export default class NotificationDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  tr_status: string;

  @IsNotEmpty()
  tr_error: string;

  @IsNotEmpty()
  tr_crc: string;

  @IsNotEmpty()
  tr_paid: number;

  @IsNotEmpty()
  md5sum: string;
}
