import { Logger, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import ms from 'ms';
import { SysPreference } from 'picsur-shared/dist/dto/sys-preferences.enum';
import { HasFailed } from 'picsur-shared/dist/types';
import { ImageDBModule } from '../../collections/image-db/image-db.module';
import { ImageFileDBService } from '../../collections/image-db/image-file-db.service';
import { PreferenceModule } from '../../collections/preference-db/preference-db.module';
import { SysPreferenceService } from '../../collections/preference-db/sys-preference-db.service';
import { ImageConverterService } from './image-converter.service';
import { ImageProcessorService } from './image-processor.service';
import { ImageManagerService } from './image.service';

@Module({
  imports: [ImageDBModule, PreferenceModule],
  providers: [
    ImageManagerService,
    ImageProcessorService,
    ImageConverterService,
  ],
  exports: [ImageManagerService],
})
export class ImageManagerModule implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger('ImageManagerModule');
  private interval: NodeJS.Timeout;

  constructor(
    private readonly prefManager: SysPreferenceService,
    private readonly imageFileDB: ImageFileDBService,
  ) {}

  async onModuleInit() {
    this.interval = setInterval(
      // Run demoManagerService.execute() every interval
      this.imageManagerCron.bind(this),
      1000 * 60 * 60,
    );
    await this.imageManagerCron();
  }

  private async imageManagerCron() {
    const remove_derivatives_after = await this.prefManager.getStringPreference(
      SysPreference.RemoveDerivativesAfter,
    );
    if (HasFailed(remove_derivatives_after)) {
      this.logger.warn('Failed to get remove_derivatives_after preference');
      return;
    }

    const after_ms = ms(remove_derivatives_after);
    if (after_ms === 0) {
      this.logger.log('remove_derivatives_after is 0, skipping cron');
      return;
    }

    const result = await this.imageFileDB.cleanupDerivatives(after_ms / 1000);
    if (HasFailed(result)) {
      this.logger.warn(`Failed to cleanup derivatives`);
    }

    this.logger.log(`Cleaned up ${result} derivatives`);
  }

  onModuleDestroy() {
    if (this.interval) clearInterval(this.interval);
  }
}
