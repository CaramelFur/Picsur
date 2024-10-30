import { Module } from '@nestjs/common';
import { RoleDbModule } from '../../../collections/role-db/role-db.module.js';
import { UserDbModule } from '../../../collections/user-db/user-db.module.js';
import { RolesController } from './roles.controller.js';

@Module({
  imports: [RoleDbModule, UserDbModule],
  controllers: [RolesController],
})
export class RolesApiModule {}
