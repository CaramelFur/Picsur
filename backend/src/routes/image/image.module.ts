import { Module } from '@nestjs/common';
import { UsersModule } from '../../collections/user-db/user-db.module';
import { DecoratorsModule } from '../../decorators/decorators.module';
import { ImageManagerModule } from '../../managers/image/image.module';
import { ImageManageController } from './image-manage.controller';
import { ImageController } from './image.controller';

@Module({
  imports: [ImageManagerModule, UsersModule, DecoratorsModule],
  controllers: [ImageController, ImageManageController],
})
export class ImageModule {}
