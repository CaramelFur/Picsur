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

export interface QOIWorkerOut extends QOIImage {
  id: number;
}

export type QOIJob = (url: string, authorization: string) => Promise<QOIImage>;
