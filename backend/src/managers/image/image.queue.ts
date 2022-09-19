import { Queue } from 'bull';
import { ImageConvertJobData } from './convert.consumer';
import { ImageIngestJobData } from './ingest.consumer';

export const ImageQueueID = 'image-queue';
export type ImageQueueType = Queue<ImageIngestJobData | ImageConvertJobData>;

export enum ImageQueueSubject {
  INGEST = 'ingest',
  CONVERT = 'convert',
}

