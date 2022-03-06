import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './routes/api/auth/auth.module';
import { ImageModule } from './routes/image/imageroute.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { DemoManagerModule } from './managers/demo/demomanager.module';
import { PrefModule } from './routes/api/pref/pref.module';
import { TypeOrmConfigService } from './config/typeorm.config.service';
import { PicsurConfigModule } from './config/config.module';
import { ServeStaticConfigService } from './config/servestatic.config.service';


@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useExisting: TypeOrmConfigService,
      imports: [PicsurConfigModule],
    }),
    ServeStaticModule.forRootAsync({
      useExisting: ServeStaticConfigService,
      imports: [PicsurConfigModule],
    }),
    AuthModule,
    ImageModule,
    DemoManagerModule,
    PrefModule,
  ],
})
export class AppModule {}
