import { FileType } from 'picsur-shared/dist/dto/mimes.dto';
import { Sharp, SharpOptions } from 'sharp';
import { SharpResult } from './universal-sharp.js';

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

  // Only for internal use
  lossless?: boolean;
  effort?: number;
}

// Messages

export interface SharpWorkerInitMessage {
  type: 'init';
  image: Buffer;
  filetype: FileType;
  options?: SharpOptions;
}

export interface SharpWorkerOperationMessage {
  type: 'operation';
  operation: SharpWorkerOperation;
}

export interface SharpWorkerFinishMessage {
  type: 'finish';
  filetype: FileType;
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
