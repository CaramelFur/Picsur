import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserEntity } from './users/user.entity';
import { UsersModule } from './users/users.module';
import Config from './env';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: Config.database.host,
      port: Config.database.port,
      username: Config.database.username,
      password: Config.database.password,
      database: Config.database.database,

      autoLoadEntities: true,
      synchronize: true,

      entities: [UserEntity],
    }),
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
