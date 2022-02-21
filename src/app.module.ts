import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './routes/auth/auth.module';
import { UserEntity } from './collections/userdb/user.entity';
import { UsersModule } from './collections/userdb/userdb.module';
import { ImageModule } from './routes/image/imageroute.module';
import Config from './env';
import { ImageEntity } from './collections/imagedb/image.entity';
import { SafeImagesModule } from './lib/safeimages/safeimages.module';

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
    AuthModule,
    UsersModule,
    ImageModule,
    SafeImagesModule,
  ],
})
export class AppModule {}
