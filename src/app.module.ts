import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserEntity } from './users/user.entity';
import { UsersModule } from './users/users.module';
import { RootModule } from './root/root.module';
import Config from './env';
import { ImageEntity } from './images/image.entity';
import { SafeImagesModule } from './safeimages/safeimages.module';

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
    RootModule,
    SafeImagesModule,
  ],
})
export class AppModule {}
