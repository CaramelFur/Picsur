import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ImageDBModule } from '../../collections/image-db/image-db.module';
import { PreferenceDbModule } from '../../collections/preference-db/preference-db.module';
import { ImageManagerModule } from '../image/image.module';
import { IngestConsumer } from './ingest.consumer';
import { IngestService } from './ingest.service';

@Module({
  imports: [
    ImageDBModule,
    ImageManagerModule,
    PreferenceDbModule,
    BullModule.registerQueue({
      name: 'image-ingest',
    }),
  ],
  providers: [IngestConsumer, IngestService],
  exports: [BullModule, IngestService],
})
export class IngestManagerModule {}
