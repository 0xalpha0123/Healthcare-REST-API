import { IsNotEmpty } from 'class-validator';

export default class TransactionDto {
  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  bank_id: number;

  @IsNotEmpty()
  extension_days: number;

  @IsNotEmpty()
  offer_id: number;
}
