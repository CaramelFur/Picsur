import { FullMime } from 'picsur-shared/dist/dto/mimes.dto';
import { Sharp } from 'sharp';
import { SharpResult } from './universal-sharp';

type MapSharpFunctions<T extends keyof Sharp> = T extends any
  ? Sharp[T] extends (...args: any) => any
    ? {
        name: T;
        parameters: Parameters<Sharp[T]>;
      }
    : never
  : never;

export type SupportedSharpWorkerFunctions =
  | 'toColorspace'
  | 'resize'
  | 'rotate'
  | 'flip'
  | 'flop'
  | 'removeAlpha'
  | 'negate'
  | 'greyscale';

export type SharpWorkerOperation =
  MapSharpFunctions<SupportedSharpWorkerFunctions>;

export interface SharpWorkerFinishOptions {
  quality?: number;
}

// Messages

export interface SharpWorkerInitMessage {
  type: 'init';
  image: Buffer;
  mime: FullMime;
}

export interface SharpWorkerOperationMessage {
  type: 'operation';
  operation: SharpWorkerOperation;
}

export interface SharpWorkerFinishMessage {
  type: 'finish';
  mime: FullMime;
  options: SharpWorkerFinishOptions;
}

export interface SharpWorkerReadyMessage {
  type: 'ready';
}

export interface SharpWorkerResultMessage {
  type: 'result';
  processingTime: number;
  result: SharpResult;
}

// Accumulators

export type SharpWorkerSendMessage =
  | SharpWorkerInitMessage
  | SharpWorkerOperationMessage
  | SharpWorkerFinishMessage;

export type SharpWorkerRecieveMessage =
  | SharpWorkerResultMessage
  | SharpWorkerReadyMessage;
