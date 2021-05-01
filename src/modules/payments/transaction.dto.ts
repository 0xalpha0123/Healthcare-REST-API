import { IsEmail, IsNotEmpty } from 'class-validator';

export default class TransactionDto {
  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  bankId: number;

  @IsNotEmpty()
  extensionDays: number;

  @IsNotEmpty()
  companyName: string;

  @IsEmail()
  userEmail: string;

  @IsNotEmpty()
  offerId: number;
}