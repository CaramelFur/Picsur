import { Module } from '@nestjs/common';
import { RolesModule } from '../../../collections/role-db/role-db.module';
import { UsersModule } from '../../../collections/user-db/user-db.module';
import { RolesController } from './roles.controller';

@Module({
  imports: [RolesModule, UsersModule],
  controllers: [RolesController],
})
export class RolesApiModule {}
