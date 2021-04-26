import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { PaymentsController } from "./payments.controller";
import { PaymentsService } from "./payments.service";

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
    ]),
  ],
  providers: [PaymentsService],
  controllers: [PaymentsController],
  exports: [],
})
export class PaymentsModule { }