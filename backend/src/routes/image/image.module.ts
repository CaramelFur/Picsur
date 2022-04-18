import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import cors from 'cors';
import { DecoratorsModule } from '../../decorators/decorators.module';
import { ImageManagerModule } from '../../managers/image/image.module';
import { ImageController } from './image.controller';

const corsConfig = cors({
  // 48 hours
  maxAge: 1728000,
});

@Module({
  imports: [ImageManagerModule, DecoratorsModule],
  controllers: [ImageController],
})
export class ImageModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(corsConfig).forRoutes('/i');
  }
}
