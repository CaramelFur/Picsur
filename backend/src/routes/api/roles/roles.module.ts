import { Module } from '@nestjs/common';
import { RoleDbModule } from '../../../collections/role-db/role-db.module';
import { UserDbModule } from '../../../collections/user-db/user-db.module';
import { RolesController } from './roles.controller';

@Module({
  imports: [RoleDbModule, UserDbModule],
  controllers: [RolesController],
})
export class RolesApiModule {}
