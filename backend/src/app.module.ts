import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './routes/api/auth/auth.module';
import { ImageModule } from './routes/image/imageroute.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import Config from './env';
import { DemoManagerModule } from './managers/demo/demomanager.module';
import { EImageBackend } from './models/entities/image.entity';
import { EUserBackend } from './models/entities/user.entity';
import { PrefModule } from './routes/api/pref/pref.module';
import { ESysPreferenceBackend } from './models/entities/syspreference.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: Config.database.host,
      port: Config.database.port,
      username: Config.database.username,
      password: Config.database.password,
      database: Config.database.database,
      synchronize: true,

      entities: [EUserBackend, EImageBackend, ESysPreferenceBackend],
    }),
    ServeStaticModule.forRoot({
      rootPath: Config.static.frontendRoot,
    }),
    AuthModule,
    ImageModule,
    DemoManagerModule,
    PrefModule,
  ],
})
export class AppModule {}
