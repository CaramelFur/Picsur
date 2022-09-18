import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { IngestConsumer } from './ingest.consumer';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'image-ingest',
    }),
  ],
  providers: [IngestConsumer],
  exports: [BullModule],
})
export class ConsumersModule {}
