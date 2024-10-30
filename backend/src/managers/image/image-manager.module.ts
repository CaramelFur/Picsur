import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import ms from 'ms';
import { SysPreference } from 'picsur-shared/dist/dto/sys-preferences.enum';
import { HasFailed } from 'picsur-shared/dist/types/failable';
import { ImageDBModule } from '../../collections/image-db/image-db.module.js';
import { ImageDBService } from '../../collections/image-db/image-db.service.js';
import { ImageFileDBService } from '../../collections/image-db/image-file-db.service.js';
import { PreferenceDbModule } from '../../collections/preference-db/preference-db.module.js';
import { SysPreferenceDbService } from '../../collections/preference-db/sys-preference-db.service.js';
import { ImageConverterService } from './image-converter.service.js';
import { ImageProcessorService } from './image-processor.service.js';
import { ImageManagerService } from './image.service.js';

@Module({
  imports: [ImageDBModule, PreferenceDbModule],
  providers: [
    ImageManagerService,
    ImageProcessorService,
    ImageConverterService,
  ],
  exports: [ImageManagerService, ImageConverterService],
})
export class ImageManagerModule implements OnModuleInit {
  private readonly logger = new Logger(ImageManagerModule.name);

  constructor(
    private readonly prefManager: SysPreferenceDbService,
    private readonly imageFileDB: ImageFileDBService,
    private readonly imageDB: ImageDBService,
  ) {}

  async onModuleInit() {
    await this.imageManagerCron();
  }

  @Interval(1000 * 60)
  private async imageManagerCron() {
    await this.cleanupDerivatives();
    await this.cleanupExpired();
  }

  private async cleanupDerivatives() {
    const remove_derivatives_after = await this.prefManager.getStringPreference(
      SysPreference.RemoveDerivativesAfter,
    );
    if (HasFailed(remove_derivatives_after)) {
      this.logger.warn('Failed to get remove_derivatives_after preference');
      return;
    }

    let after_ms = ms(remove_derivatives_after as string);
    if (isNaN(after_ms) || after_ms === 0) {
      this.logger.log('remove_derivatives_after is 0, skipping cron');
      return;
    }
    if (after_ms < 60000) after_ms = 60000;

    const result = await this.imageFileDB.cleanupDerivatives(after_ms / 1000);
    if (HasFailed(result)) {
      result.print(this.logger);
      return;
    }

    if (result > 0) this.logger.log(`Cleaned up ${result} derivatives`);
  }

  private async cleanupExpired() {
    const cleanedUp = await this.imageDB.cleanupExpired();

    if (HasFailed(cleanedUp)) {
      cleanedUp.print(this.logger);
      return;
    }

    if (cleanedUp > 0)
      this.logger.log(`Cleaned up ${cleanedUp} expired images`);
  }
}
