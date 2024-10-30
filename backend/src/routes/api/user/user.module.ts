import { Module } from '@nestjs/common';
import { AuthManagerModule } from '../../../managers/auth/auth.module.js';
import { UserAdminController } from './user-manage.controller.js';
import { UserController } from './user.controller.js';

@Module({
  imports: [AuthManagerModule],
  controllers: [UserController, UserAdminController],
})
export class UserApiModule {}
