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
import { GetAuthorizedUser } from 'src/common/decorators/getAuthorizedUser.decorator';
import { Bank } from 'src/modules/payments/bank.interface';
import { User } from '../auth/user.entity';
import NotificationDto from './notification.dto';
import { Payment } from './payment.entity';
import { PaymentsService } from './payments.service';
import TransactionDto from './transaction.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @UseGuards(AuthGuard())
  @Get()
  @HttpCode(200)
  findAll(@GetAuthorizedUser() user: User): Promise<Payment[]> {
    return this.paymentsService.getPaymentsByUserId(user.id);
  }

  @Get('banks')
  @HttpCode(200)
  findBanks(): Promise<Bank[]> {
    return this.paymentsService.getBanks();
  }

  @UseGuards(AuthGuard())
  @Post('transaction')
  @HttpCode(201)
  createTransaction(
    @Body(ValidationPipe) transactionDto: TransactionDto,
    @GetAuthorizedUser() user: User,
  ): Promise<String> {
    return this.paymentsService.createTransaction(transactionDto, user);
  }

  @Post('notification')
  @HttpCode(201)
  handleNotification(
    @Body(ValidationPipe) notificationDto: NotificationDto,
  ): Promise<void> {
    return this.paymentsService.handleNotification(notificationDto);
  }
}
