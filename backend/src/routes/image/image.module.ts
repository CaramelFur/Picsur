import { Module } from '@nestjs/common';
import { IngestFileDbModule } from '../../collections/ingest-file-db/ingest-file-db.module';
import { UserDbModule } from '../../collections/user-db/user-db.module';
import { DecoratorsModule } from '../../decorators/decorators.module';
import { ImageManagerModule } from '../../managers/image/image.module';
import { IngestManagerModule } from '../../managers/ingest/ingest.module';
import { ImageManageController } from './image-manage.controller';
import { ImageController } from './image.controller';

@Module({
  imports: [
    ImageManagerModule,
    UserDbModule,
    IngestFileDbModule,
    IngestManagerModule,
    DecoratorsModule,
  ],
  controllers: [ImageController, ImageManageController],
})
export class ImageModule {}
