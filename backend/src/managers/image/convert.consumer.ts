import { OnQueueError, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import type { Job } from 'bull';
import { ImageRequestParams } from 'picsur-shared/dist/dto/api/image.dto';
import { SysPreference } from 'picsur-shared/dist/dto/sys-preferences.enum';
import { IsFailure, ThrowIfFailed } from 'picsur-shared/dist/types';
import { ParseFileType } from 'picsur-shared/dist/util/parse-mime';
import { ImageFileDBService } from '../../collections/image-db/image-file-db.service';
import { SysPreferenceDbService } from '../../collections/preference-db/sys-preference-db.service';
import { ImageConverterService } from './image-converter.service';
import { ImageManagerService } from './image-manager.service';
import { ImageConvertQueueID } from './image.queue';

// This contains the job to convert an image to a derivative and store it

export interface ImageConvertJobData {
  uniqueKey: string;
  imageId: string;
  fileType: string;
  options: ImageRequestParams;
}
export type ImageConvertJob = Job<ImageConvertJobData>;

@Processor(ImageConvertQueueID)
export class ConvertConsumer {
  private readonly logger = new Logger(ConvertConsumer.name);

  constructor(
    private readonly imageFilesService: ImageFileDBService,
    private readonly imageConverter: ImageConverterService,
    private readonly sysPref: SysPreferenceDbService,
    private readonly imageService: ImageManagerService,
  ) {}

  @Process()
  async convertImage(job: ImageConvertJob): Promise<void> {
    const { imageId, fileType, options, uniqueKey } = job.data;

    // Get file type
    const targetFileType = ThrowIfFailed(ParseFileType(fileType));

    // Get preferences
    const allow_editing = ThrowIfFailed(
      await this.sysPref.getBooleanPreference(SysPreference.AllowEditing),
    );

    // Get master image
    const masterImage = ThrowIfFailed(
      await this.imageService.getMaster(imageId),
    );
    const sourceFileType = ThrowIfFailed(ParseFileType(masterImage.filetype));

    // Conver timage
    const startTime = Date.now();
    const convertResult = ThrowIfFailed(
      await this.imageConverter.convert(
        masterImage.data,
        sourceFileType,
        targetFileType,
        allow_editing ? options : {},
      ),
    );

    this.logger.verbose(
      `Converted ${imageId} from ${sourceFileType.identifier} to ${
        targetFileType.identifier
      } in ${Date.now() - startTime}ms`,
    );

    ThrowIfFailed(
      await this.imageFilesService.addDerivative(
        imageId,
        uniqueKey,
        convertResult.filetype,
        convertResult.image,
      ),
    );
  }

  @OnQueueError()
  async handleError(error: any) {
    if (IsFailure(error)) error.print(this.logger);
    else this.logger.error(error);
  }

  @OnQueueFailed()
  async handleFailed(job: Job, error: any) {
    if (IsFailure(error))
      error.print(this.logger, {
        prefix: `[JOB ${job.id}]`,
      });
    else this.logger.error(error);
  }
}
