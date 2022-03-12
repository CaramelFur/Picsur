import { Module } from '@nestjs/common';
import { RolesModule } from '../../../collections/roledb/roledb.module';
import { RolesController } from './roles.controller';

@Module({
  imports: [RolesModule],
  controllers: [RolesController],
})
export class RolesApiModule {}
