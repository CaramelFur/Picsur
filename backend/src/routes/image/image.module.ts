import { Module } from '@nestjs/common';
import { UserDbModule } from '../../collections/user-db/user-db.module.js';
import { DecoratorsModule } from '../../decorators/decorators.module.js';
import { ImageManagerModule } from '../../managers/image/image-manager.module.js';
import { ImageManageController } from './image-manage.controller.js';
import { ImageController } from './image.controller.js';

@Module({
  imports: [ImageManagerModule, UserDbModule, DecoratorsModule],
  controllers: [ImageController, ImageManageController],
})
export class ImageModule {}
