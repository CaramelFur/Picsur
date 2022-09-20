import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import Crypto from 'crypto';
import { ImageRequestParams } from 'picsur-shared/dist/dto/api/image.dto';
import {
  AsyncFailable,
  Fail,
  FT,
  HasFailed,
  ThrowIfFailed,
} from 'picsur-shared/dist/types';
import { ImageFileDBService } from '../../collections/image-db/image-file-db.service';
import { EImageDerivativeBackend } from '../../database/entities/images/image-derivative.entity';
import { ImageConvertJob } from './convert.consumer';
import * as ImageQueue from './image.queue';

@Injectable()
export class ConvertService {
  constructor(
    @InjectQueue(ImageQueue.ImageConvertQueueID)
    private readonly imageQueue: ImageQueue.ImageConvertQueue,
    private readonly imageFilesService: ImageFileDBService,
  ) {}

  public async convertJob(
    imageId: string,
    fileType: string,
    options: ImageRequestParams,
  ): AsyncFailable<ImageConvertJob> {
    const jobID = this.getConvertHash(imageId, { fileType, ...options });

    /*
    Jobs with the same ID don't get executed, we abuse this by passing it a hash of the input parameters.
    This way, if the same image is requested with the same parameters, we don't have to convert it again.
    Since it will always produce the same output with the same inputs
    */

    let job: ImageConvertJob;
    try {
      job = (await this.imageQueue.add(
        {
          imageId,
          fileType,
          options,
          uniqueKey: jobID,
        },
        {
          jobId: jobID,
        },
      )) as ImageConvertJob;
    } catch (e) {
      return Fail(FT.Internal, e);
    }

    if (!job.id) return Fail(FT.Internal, undefined, 'Failed to queue job');
    return job;
  }

  public async convertPromise(
    imageId: string,
    fileType: string,
    options: ImageRequestParams,
  ): AsyncFailable<EImageDerivativeBackend> {
    const uniqueKey = this.getConvertHash(imageId, { fileType, ...options });

    const startime = Date.now();
    const findExisting = ThrowIfFailed(
      await this.imageFilesService.getDerivative(imageId, uniqueKey),
    );
    if (findExisting !== null) {
      console.log('Found existing derivative in ' + (Date.now() - startime));
      return findExisting;
    }

    const job = await this.convertJob(imageId, fileType, options);
    if (HasFailed(job)) return job;

    try {
      await job.finished();
    } catch (e) {
      return Fail(FT.Internal, 'Failed to convert image', e);
    }

    const findResult = ThrowIfFailed(
      await this.imageFilesService.getDerivative(imageId, uniqueKey),
    );
    if (findResult !== null) {
      console.log('Found new derivative');
      return findResult;
    }

    return Fail(FT.Internal, 'Failed to convert image');
  }

  private getConvertHash(imageID: string, options: object) {
    // Return a sha256 hash of the stringified options
    const stringified = JSON.stringify(options) + '-' + imageID;
    const hash = Crypto.createHash('sha256');
    hash.update(stringified);
    const digest = hash.digest('hex');
    return digest;
  }
}
