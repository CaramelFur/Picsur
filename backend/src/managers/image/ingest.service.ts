import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { fileTypeFromBuffer, FileTypeResult } from 'file-type';
import { ImageEntryVariant } from 'picsur-shared/dist/dto/image-entry-variant.enum';
import {
  AnimFileType,
  FileType,
  ImageFileType,
  Mime2FileType
} from 'picsur-shared/dist/dto/mimes.dto';
import { UsrPreference } from 'picsur-shared/dist/dto/usr-preferences.enum';
import { AsyncFailable, Fail, FT, HasFailed } from 'picsur-shared/dist/types';
import { ParseFileType } from 'picsur-shared/dist/util/parse-mime';
import { IsQOI } from 'qoi-img';
import { ImageDBService } from '../../collections/image-db/image-db.service';
import { ImageFileDBService } from '../../collections/image-db/image-file-db.service';
import { UsrPreferenceDbService } from '../../collections/preference-db/usr-preference-db.service';
import { EImageBackend } from '../../database/entities/images/image.entity';
import { WebPInfo } from '../image/webpinfo/webpinfo';
import * as ImageQueue from './image.queue';
import { ImageIngestJob } from './ingest.consumer';

@Injectable()
export class IngestService {
  private readonly logger = new Logger(IngestService.name);

  constructor(
    @InjectQueue(ImageQueue.ImageQueueID)
    private readonly imageQueue: ImageQueue.ImageQueueType,
    private readonly imagesService: ImageDBService,
    private readonly imageFilesService: ImageFileDBService,
    private readonly userPref: UsrPreferenceDbService,
  ) {}

  public async uploadJob(
    userid: string,
    filename: string,
    image: Buffer,
    withDeleteKey: boolean,
  ): AsyncFailable<[ImageIngestJob, EImageBackend]> {
    const fileType = await this.getFileTypeFromBuffer(image);
    if (HasFailed(fileType)) return fileType;

    // Check if need to save orignal
    const keepOriginal = await this.userPref.getBooleanPreference(
      userid,
      UsrPreference.KeepOriginal,
    );
    if (HasFailed(keepOriginal)) return keepOriginal;

    // Strip extension from filename
    const name = (() => {
      const index = filename.lastIndexOf('.');
      if (index === -1) return filename;
      return filename.substring(0, index);
    })();

    // Save unprocessed image to be processed by worker
    const imageEntity = await this.imagesService.create(
      userid,
      name,
      withDeleteKey,
    );
    if (HasFailed(imageEntity)) return imageEntity;

    const imageFileEntity = await this.imageFilesService.setFile(
      imageEntity.id,
      ImageEntryVariant.INGEST,
      image,
      fileType.identifier,
    );
    if (HasFailed(imageFileEntity)) return imageFileEntity;

    try {
      const job = (await this.imageQueue.add(
        ImageQueue.ImageQueueSubject.INGEST,
        {
          imageID: imageEntity.id,
          storeOriginal: keepOriginal,
        },
      )) as ImageIngestJob;
      if (!job.id) return Fail(FT.Internal, undefined, 'Failed to queue job');

      return [job, imageEntity];
    } catch (e) {
      return Fail(FT.Internal, e);
    }
  }

  public async uploadPromise(
    userid: string,
    filename: string,
    image: Buffer,
    withDeleteKey: boolean,
  ): AsyncFailable<EImageBackend> {
    const result = await this.uploadJob(userid, filename, image, withDeleteKey);
    if (HasFailed(result)) return result;

    const [job, imageEntity] = result;

    try {
      await job.finished();
      return imageEntity;
    } catch (e) {
      return Fail(FT.Internal, 'Failed to process image', e);
    }
  }

  private async getFileTypeFromBuffer(image: Buffer): AsyncFailable<FileType> {
    const filetypeResult: FileTypeResult | undefined = await fileTypeFromBuffer(
      image,
    );

    let mime: string | undefined;
    if (filetypeResult === undefined) {
      if (IsQOI(image)) mime = 'image/x-qoi';
    } else {
      mime = filetypeResult.mime;
    }

    if (mime === undefined) mime = 'other/unknown';

    let filetype: string | undefined;
    if (mime === 'image/webp') {
      const header = await WebPInfo.from(image);
      if (header.summary.isAnimated) filetype = AnimFileType.WEBP;
      else filetype = ImageFileType.WEBP;
    }
    if (filetype === undefined) {
      const parsed = Mime2FileType(mime);
      if (HasFailed(parsed)) return parsed;
      filetype = parsed;
    }

    return ParseFileType(filetype);
  }
}
