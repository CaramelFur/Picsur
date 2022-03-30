import { Module } from '@nestjs/common';
import { RolesModule } from '../../../collections/roledb/roledb.module';
import { UsersModule } from '../../../collections/userdb/userdb.module';
import { RolesController } from './roles.controller';

@Module({
  imports: [RolesModule, UsersModule],
  controllers: [RolesController],
})
export class RolesApiModule {}
