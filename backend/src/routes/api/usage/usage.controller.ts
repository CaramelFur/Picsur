import { Controller, Logger, Post, Req, Res } from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { FT, Fail, ThrowIfFailed } from 'picsur-shared/dist/types/failable';
import { UsageConfigService } from '../../../config/late/usage.config.service.js';
import { EasyThrottle } from '../../../decorators/easy-throttle.decorator.js';
import { NoPermissions } from '../../../decorators/permissions.decorator.js';
import { ReturnsAnything } from '../../../decorators/returns.decorator.js';

@Controller('api/usage')
@NoPermissions()
export class UsageController {
  private readonly logger = new Logger(UsageController.name);

  constructor(private readonly usageService: UsageConfigService) {}

  @Post(['report', 'report/*'])
  @ReturnsAnything()
  @EasyThrottle(120)
  async deleteRole(
    @Req() req: FastifyRequest,
    @Res({
      passthrough: true,
    })
    res: FastifyReply,
  ) {
    const trackingUrl = ThrowIfFailed(await this.usageService.getTrackingUrl());

    if (trackingUrl === null) {
      throw Fail(FT.NotFound, undefined, 'Tracking URL not set');
    }

    await res.from(`${trackingUrl}/api`, {
      rewriteRequestHeaders(request, headers) {
        const req = request as any as FastifyRequest;

        // remove cookies
        delete headers.cookie;

        // Add real ip, this should not work, but ackee uses a bad ip resolver
        // So we might aswell use it
        headers['X-Forwarded-For'] = req.ip;

        return headers;
      },
    });
  }
}
