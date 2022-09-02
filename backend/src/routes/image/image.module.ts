import { Module } from '@nestjs/common';
import { UserDbModule } from '../../collections/user-db/user-db.module';
import { DecoratorsModule } from '../../decorators/decorators.module';
import { ImageManagerModule } from '../../managers/image/image.module';
import { ImageManageController } from './image-manage.controller';
import { ImageController } from './image.controller';

@Module({
  imports: [ImageManagerModule, UserDbModule, DecoratorsModule],
  controllers: [ImageController, ImageManageController],
})
export class ImageModule {}
