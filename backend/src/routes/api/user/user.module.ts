import { Module } from '@nestjs/common';
import { AuthManagerModule } from '../../../managers/auth/auth.module';
import { UserManageController } from './user-manage.controller';
import { UserController } from './user.controller';

@Module({
  imports: [AuthManagerModule],
  controllers: [UserController, UserManageController],
})
export class UserApiModule {}
