import {
  Controller,
  Get,
  HttpCode,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';


@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService,
  ) { }

  @Get('banks')
  @HttpCode(200)
  findAll(): Promise<Object> {
    return this.paymentsService.getBanks();
  }

}
