import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EUser } from 'imagur-shared/dist/entities/user.entity';
import { UsersService } from './userdb.service';

@Module({
  imports: [TypeOrmModule.forFeature([EUser])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
