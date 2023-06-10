import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
const cookieSession = require('cookie-session'); // compatibility issue

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';

@Module({
  imports: [
    // Connect to the database
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Report],
      synchronize: true, // only development (using migrations in production)
    }),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      // session, validationPipe is not wired up when e2e testing (It works well in development mode)
      // so we need to wire it up in AppModule not in main.ts
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true, // This will remove any properties that don't have a matching DTO
      }),
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // This will run for every incoming request
    consumer
      .apply(
        // middleware(authentication)
        cookieSession({
          keys: ['suyeonme'],
        }),
      )
      .forRoutes('*'); // target to every sinlge request
  }
}
