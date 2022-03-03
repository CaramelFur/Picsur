import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EUserBackend } from '../../models/entities/user.entity';
import { UsersService } from './userdb.service';

@Module({
  imports: [TypeOrmModule.forFeature([EUserBackend])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
