import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OffersController } from './offers.controller';
import { Offer } from './entities/offer.entity';
import { OffersService } from './offers.service';
import { AuthModule } from '../auth/auth.module';
import { AgreementType } from './entities/agreement_type.entity';
import { Profession } from './entities/profession.entity';
import { Specialization } from './entities/specialization.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      Offer,
      AgreementType,
      Profession,
      Specialization,
    ]),
  ],
  providers: [OffersService],
  controllers: [OffersController],
  exports: [],
})
export class OffersModule {}
