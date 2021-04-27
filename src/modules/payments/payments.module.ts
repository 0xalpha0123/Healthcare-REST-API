import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { Payment } from "./payment.entity";
import { PaymentsController } from "./payments.controller";
import { PaymentsService } from "./payments.service";

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      Payment
    ]),
  ],
  providers: [PaymentsService],
  controllers: [PaymentsController],
  exports: [],
})
export class PaymentsModule { }