import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './routes/api/auth/auth.module';
import { ImageModule } from './routes/image/imageroute.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import Config from './env';
import { DemoManagerModule } from './managers/demo/demomanager.module';
import { EUser } from 'picsur-shared/dist/entities/user.entity';
import { EImage } from 'picsur-shared/dist/entities/image.entity';

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

      entities: [EUser, EImage],
    }),
    ServeStaticModule.forRoot({
      rootPath: Config.static.frontendRoot,
    }),
    AuthModule,
    ImageModule,
    DemoManagerModule,
  ],
})
export class AppModule {
}
