import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EarlyConfigModule } from '../config/early/early-config.module';
import { TypeOrmConfigService } from '../config/early/type-orm.config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useExisting: TypeOrmConfigService,
      imports: [EarlyConfigModule],
    }),
  ],
})
export class DatabaseModule {}
