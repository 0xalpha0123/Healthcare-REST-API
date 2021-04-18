import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AwsSdkModule } from 'nest-aws-sdk';
import { S3 } from 'aws-sdk';

import Configuration from './config/configuration';

import { S3ManagerModule } from './modules/s3manager/s3-manager.module';
import { AuthModule } from './modules/auth/auth.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { OffersModule } from './modules/offers/offers.module';

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
    S3ManagerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
