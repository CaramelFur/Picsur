import { Module } from '@nestjs/common';
import { AuthManagerModule } from '../../../managers/auth/auth.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [AuthManagerModule],
  controllers: [AuthController],
})
export class AuthModule {}
