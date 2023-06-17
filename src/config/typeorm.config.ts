import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
 
@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}
 
  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    return {
      type: 'sqlite',
      database: this.configService.get<string>('DB_NAME'),
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV === 'test',
      migrationsRun: process.env.NODE_ENV === 'test',
      keepConnectionAlive: process.env.NODE_ENV === 'test',
    };
  }
}