import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

const cookieSession = require('cookie-session'); // compatibility issue

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // authentication
  app.use(
    cookieSession({
      keys: ["suyeonme"],
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // This will remove any properties that don't have a matching DTO
    }),
  );
  await app.listen(3000);
}

bootstrap();
