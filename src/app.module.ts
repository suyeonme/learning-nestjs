import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

const cookieSession = require('cookie-session'); // compatibility issue

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';

@Module({
  imports: [
    // env config
    ConfigModule.forRoot({
      isGlobal: true, // available everywhere
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    // Connect to the database based on env
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        // Dependency injection
        return {
          type: 'sqlite',
          database: config.get<string>('DB_NAME'),
          entities: [User, Report],
          synchronize: true, // only development (using migrations in production)
        };
      },
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
  constructor(private configService: ConfigService) {}
  /**
   * @Middleware Cookie-session
   * This will run for every incoming request
   */
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: [this.configService.get<string>('COOKIE_KEY')],
        }),
      )
      .forRoutes('*'); // target to every sinlge request
  }
}
