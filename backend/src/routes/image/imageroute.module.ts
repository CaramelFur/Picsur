import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import cors from 'cors';
import { DecoratorsModule } from '../../decorators/decorators.module';
import { ImageManagerModule } from '../../managers/imagemanager/imagemanager.module';
import { ImageIdValidator } from './imageid.validator';
import { ImageController } from './imageroute.controller';

const corsConfig = cors({
  // 48 hours
  maxAge: 1728000,
});

@Module({
  imports: [ImageManagerModule, DecoratorsModule],
  providers: [ImageIdValidator],
  controllers: [ImageController],
})
export class ImageModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(corsConfig).forRoutes('/i');
  }
}
