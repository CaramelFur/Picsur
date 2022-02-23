import { Module, NestModule, RequestMethod } from '@nestjs/common';
import { FrontendMiddleware } from './frontend.middleware';

@Module({})
export class FrontendModule implements NestModule {
  configure(consumer: any) {
    consumer.apply(FrontendMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
