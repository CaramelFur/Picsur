import { Queue } from 'bull';
import { ImageConvertJobData } from './convert.consumer';
import { ImageIngestJobData } from './ingest.consumer';

export const ImageConvertQueueID = 'image-convert-queue';
export const ImageIngestQueueID = 'image-ingest-queue';

export type ImageConvertQueue = Queue<ImageConvertJobData>;
export type ImageIngestQueue = Queue<ImageIngestJobData>;
