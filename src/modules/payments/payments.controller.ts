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
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @UseGuards(AuthGuard())
  @Get()
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description:
      'The payments has been successfully fetched for authorized user.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  findAll(@GetAuthorizedUser() user: User): Promise<Payment[]> {
    return this.paymentsService.getPaymentsByUserId(user.id);
  }

  @Get('banks')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description:
      'The banks has been successfully fetched.',
  })
  findBanks(): Promise<Bank[]> {
    return this.paymentsService.getBanks();
  }

  @UseGuards(AuthGuard())
  @Post('transaction')
  @HttpCode(201)
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description:
      'The payment has been successfully created for authorized user.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  createTransaction(
    @Body(ValidationPipe) transactionDto: TransactionDto,
    @GetAuthorizedUser() user: User,
  ): Promise<string> {
    return this.paymentsService.createTransaction(transactionDto, user);
  }

  @Post('notification')
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'The payment notification has been successfully handled.',
  })
  handleNotification(
    @Body(ValidationPipe) notificationDto: NotificationDto,
  ): Promise<void> {
    return this.paymentsService.handleNotification(notificationDto);
  }
}
