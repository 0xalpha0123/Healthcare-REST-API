import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';

async function bootstrap() {
  const port = process.env.PORT || 3000;
  const app: INestApplication = await NestFactory.create(AppModule);
  await app.listen(port, () => {
    console.log(`App started on port ${port}`);
  });
}
bootstrap();
