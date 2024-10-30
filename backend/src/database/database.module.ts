import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EarlyConfigModule } from '../config/early/early-config.module.js';
import { TypeOrmConfigService } from '../config/early/type-orm.config.service.js';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useExisting: TypeOrmConfigService,
      imports: [EarlyConfigModule],
    }),
  ],
})
export class DatabaseModule {}
