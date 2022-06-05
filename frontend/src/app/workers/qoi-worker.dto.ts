import { AsyncFailable, Failable } from 'picsur-shared/dist/types';

export interface QOIImage {
  data: ImageData;
  width: number;
  height: number;
}

export interface QOIWorkerIn {
  id: number;
  url: string;
  authorization: string;
}

export interface QOIWorkerOut {
  id: number;
  result: Failable<QOIImage>;
}

export type QOIJob = (
  url: string,
  authorization: string,
) => AsyncFailable<QOIImage>;
