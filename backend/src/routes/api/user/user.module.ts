import { Module } from '@nestjs/common';
import { AuthManagerModule } from '../../../managers/auth/auth.module';
import { UserController } from './user.controller';
import { UserManageController } from './usermanage.controller';

@Module({
  imports: [AuthManagerModule],
  controllers: [UserController, UserManageController],
})
export class UserApiModule {}
