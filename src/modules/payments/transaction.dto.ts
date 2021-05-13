import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class TransactionDto {
  @ApiProperty()
  @IsNotEmpty()
  amount: number;

  @ApiProperty()
  @IsNotEmpty()
  bank_id: number;

  @ApiProperty()
  @IsNotEmpty()
  extension_days: number;

  @ApiProperty()
  @IsNotEmpty()
  offer_id: number;
}
