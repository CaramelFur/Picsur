import { AsyncFailable, Failable } from 'picsur-shared/dist/types/failable';

export interface QOIImage {
  data: ImageData;
  width: number;
  height: number;
}

export interface QOIWorkerIn {
  id: string;
  url: string;
  authorization: string;
}

export interface QOIWorkerOut {
  id: string;
  result: Failable<QOIImage>;
}

export type QOIJob = (
  url: string,
  authorization: string,
) => AsyncFailable<QOIImage>;
