import { Controller, Logger, Post, Req, Res } from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { Fail, FT, ThrowIfFailed } from 'picsur-shared/dist/types';
import { NoPermissions } from '../../../decorators/permissions.decorator';
import { ReturnsAnything } from '../../../decorators/returns.decorator';
import { UsageService } from '../../../managers/usage/usage.service';

@Controller('api/usage')
@NoPermissions()
export class UsageController {
  private readonly logger = new Logger(UsageController.name);

  constructor(private readonly usageService: UsageService) {}

  @Post(['report', 'report/*'])
  @ReturnsAnything()
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
      }
    });
  }
}
