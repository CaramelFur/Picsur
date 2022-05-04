import { Module } from '@nestjs/common';
import { AuthManagerModule } from '../../../managers/auth/auth.module';
import { UserAdminController } from './user-manage.controller';
import { UserController } from './user.controller';

@Module({
  imports: [AuthManagerModule],
  controllers: [UserController, UserAdminController],
})
export class UserApiModule {}
