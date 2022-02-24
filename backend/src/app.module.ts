import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './routes/api/auth/auth.module';
import { UserEntity } from './collections/userdb/user.entity';
import { ImageModule } from './routes/image/imageroute.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import Config from './env';
import { ImageEntity } from './collections/imagedb/image.entity';

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

      entities: [UserEntity, ImageEntity],
    }),
    ServeStaticModule.forRoot({
      rootPath: Config.static.frontendRoot,
    }),
    AuthModule,
    ImageModule,
  ],
})
export class AppModule {}
