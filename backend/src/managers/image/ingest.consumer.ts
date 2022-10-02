import { OnQueueError, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import type { Job } from 'bull';
import { ImageEntryVariant } from 'picsur-shared/dist/dto/image-entry-variant.enum';
import {
  FileType,
  ImageFileType,
  SupportedFileTypeCategory,
} from 'picsur-shared/dist/dto/mimes.dto';
import {
  AsyncFailable,
  Fail,
  FT,
  HasFailed,
  IsFailure,
  ThrowIfFailed,
} from 'picsur-shared/dist/types';
import { ParseFileType } from 'picsur-shared/dist/util/parse-mime';
import { ImageDBService } from '../../collections/image-db/image-db.service';
import { ImageFileDBService } from '../../collections/image-db/image-file-db.service';
import { EImageBackend } from '../../database/entities/images/image.entity';
import { ImageConverterService } from '../image/image-converter.service';
import { ImageResult } from '../image/imageresult';
import { ImageIngestQueueID } from './image.queue';

export interface ImageIngestJobData {
  imageID: string;
  storeOriginal: boolean;
}
export type ImageIngestJob = Job<ImageIngestJobData>;

@Processor(ImageIngestQueueID)
export class IngestConsumer {
  private readonly logger = new Logger(IngestConsumer.name);

  constructor(
    private readonly imagesService: ImageDBService,
    private readonly imageFilesService: ImageFileDBService,
    private readonly imageConverter: ImageConverterService,
  ) {}

  @Process({
    concurrency: 5,
  })
  async ingestImage(job: ImageIngestJob): Promise<EImageBackend> {
    const { imageID, storeOriginal } = job.data;

    // Already start the query for the image, we only need it when returning
    const imagePromise = this.imagesService.findOne(imageID, undefined);

    this.logger.verbose(
      `Ingesting image ${imageID} and store original: ${storeOriginal}`,
    );

    const ingestFile = ThrowIfFailed(
      await this.imageFilesService.getFile(imageID, ImageEntryVariant.INGEST),
    );
    const ingestFileData = ThrowIfFailed(
      await this.imageFilesService.getData(ingestFile),
    );
    const ingestFiletype = ThrowIfFailed(ParseFileType(ingestFile.filetype));

    const processed = ThrowIfFailed(
      await this.process(ingestFileData, ingestFiletype),
    );

    const masterPromise = this.imageFilesService.setFile(
      imageID,
      ImageEntryVariant.MASTER,
      processed.image,
      processed.filetype,
    );

    const originalPromise = storeOriginal
      ? this.imageFilesService.migrateFile(
          imageID,
          ImageEntryVariant.INGEST,
          ImageEntryVariant.ORIGINAL,
        )
      : this.imageFilesService.orphanFile(imageID, ImageEntryVariant.INGEST);

    const results = await Promise.all([masterPromise, originalPromise]);
    results.map((r) => ThrowIfFailed(r));

    const image = ThrowIfFailed(await imagePromise);

    this.logger.verbose(`Ingested image ${imageID}`);

    return image;
  }

  private async process(
    image: Buffer,
    filetype: FileType,
  ): AsyncFailable<ImageResult> {
    if (filetype.category === SupportedFileTypeCategory.Image) {
      return await this.processStill(image, filetype);
    } else if (filetype.category === SupportedFileTypeCategory.Animation) {
      return await this.processAnimation(image, filetype);
    } else {
      return Fail(FT.SysValidation, 'Unsupported mime type');
    }
  }

  private async processStill(
    image: Buffer,
    filetype: FileType,
  ): AsyncFailable<ImageResult> {
    const outputFileType = ParseFileType(ImageFileType.QOI);
    if (HasFailed(outputFileType)) return outputFileType;

    return this.imageConverter.convert(image, filetype, outputFileType, {});
  }

  private async processAnimation(
    image: Buffer,
    filetype: FileType,
  ): AsyncFailable<ImageResult> {
    // Webps and gifs are stored as is for now
    return {
      image: image,
      filetype: filetype.identifier,
    };
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
