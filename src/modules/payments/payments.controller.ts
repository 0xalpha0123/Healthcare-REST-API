import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Bank } from 'src/modules/payments/bank.interface';
import NotificationDto from './notification.dto';
import { PaymentsService } from './payments.service';
import TransactionDto from './transaction.dto';


@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService,
  ) { }

  @Get('banks')
  @HttpCode(200)
  findAll(): Promise<Bank[]> {
    return this.paymentsService.getBanks();
  }

  @UseGuards(AuthGuard())
  @Post('transaction')
  @HttpCode(201)
  createTransaction(@Body(ValidationPipe) transactionDto: TransactionDto): Promise<String> {
    return this.paymentsService.createTransaction(transactionDto)
  }

  @Post('notification')
  @HttpCode(201)
  handleNotification(@Body(ValidationPipe) notificationDto: NotificationDto): Promise<void> {
    return this.paymentsService.handleNotification(notificationDto)
  }

}
