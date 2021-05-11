import { IsNotEmpty } from 'class-validator';

export default class TransactionDto {
  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  bankId: number;

  @IsNotEmpty()
  extensionDays: number;

  @IsNotEmpty()
  offerId: number;
}
