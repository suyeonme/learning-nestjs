import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    switch (process.env.NODE_ENV) {
      case 'production':
        return {
          type: 'postgres',
          url: process.env.DATABASE_URL,
          database: this.configService.get<string>('DB_NAME'),
          autoLoadEntities: true,
          synchronize: false,
          migrationsRun: true,
          keepConnectionAlive: false,
          ssl: { rejectUnauthorized: false },
        };
      case 'test':
        return {
          type: 'sqlite',
          database: this.configService.get<string>('DB_NAME'),
          autoLoadEntities: true,
          synchronize: true,
          migrationsRun: true,
          keepConnectionAlive: true,
        };
      default:
        return {
          type: 'sqlite',
          database: this.configService.get<string>('DB_NAME'),
          autoLoadEntities: true,
          synchronize: true,
          migrationsRun: false,
          keepConnectionAlive: true,
        };
    }
  }
}
