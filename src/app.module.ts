import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AwsSdkModule } from 'nest-aws-sdk';
import { S3 } from 'aws-sdk';

import Configuration from './config/configuration';

import { AuthModule } from './modules/auth/auth.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { OffersModule } from './modules/offers/offers.module';
import { CandidatesModule } from './modules/candidates/candidates.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [Configuration],
    }),
    AwsSdkModule.forRootAsync({
      defaultServiceOptions: {
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => configService.get('aws'),
      },
      services: [S3],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('database'),
    }),
    AuthModule,
    CompaniesModule,
    OffersModule,
    CandidatesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
