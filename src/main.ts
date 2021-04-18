import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './exception-filters/all-exceptions.filter';

import { INestApplication } from '@nestjs/common';

async function bootstrap() {
  const port = process.env.APP_PORT || 3000;
  const app: INestApplication = await NestFactory.create(AppModule);
    app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(port, () => {
    console.log(`App started on port ${port}`);
  });
}
bootstrap();
