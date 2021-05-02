import { HttpModule, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { CompaniesModule } from "../companies/companies.module";
import { Payment } from "./payment.entity";
import { PaymentsController } from "./payments.controller";
import { PaymentsService } from "./payments.service";

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      Payment
    ]),
    HttpModule,
    CompaniesModule
  ],
  providers: [PaymentsService],
  controllers: [PaymentsController],
  exports: [],
})
export class PaymentsModule { }