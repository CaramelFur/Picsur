import { Logger } from '@nestjs/common';
import { ChildProcess, fork } from 'child_process';
import pTimeout from 'p-timeout';
import { dirname, join as pathJoin } from 'path';
import { FileType } from 'picsur-shared/dist/dto/mimes.dto';
import {
  AsyncFailable,
  Fail,
  Failable,
  FT,
  HasFailed,
} from 'picsur-shared/dist/types/failable';
import { Sharp, SharpOptions } from 'sharp';
import {
  SharpWorkerFinishOptions,
  SharpWorkerOperation,
  SharpWorkerRecieveMessage,
  SharpWorkerResultMessage,
  SharpWorkerSendMessage,
  SupportedSharpWorkerFunctions,
} from './sharp/sharp.message.js';
import { SharpResult } from './sharp/universal-sharp.js';

const moduleURL = new URL(import.meta.url);
const __dirname = dirname(moduleURL.pathname);

export class SharpWrapper {
  private readonly workerID: number = Math.floor(Math.random() * 100000);
  private readonly logger: Logger = new Logger('SharpWrapper' + this.workerID);

  private static readonly WORKER_PATH = pathJoin(
    __dirname,
    './sharp',
    'sharp.worker.js',
  );

  private worker: ChildProcess | null = null;

  constructor(
    private readonly instance_timeout: number,
    private readonly memory_limit: number,
  ) {}

  public async start(
    image: Buffer,
    filetype: FileType,
    sharpOptions?: SharpOptions,
  ): AsyncFailable<true> {
    this.worker = fork(SharpWrapper.WORKER_PATH, {
      serialization: 'advanced',
      timeout: this.instance_timeout,
      env: {
        MEMORY_LIMIT_MB: this.memory_limit.toString(),
        NODE_OPTIONS: '--no-warnings',
      },
      stdio: 'overlapped',
    });

    this.worker.stdout?.on('data', (data) => {
      this.logger.verbose(`Worker log: ${data}`);
    });
    this.worker.stderr?.on('data', (data) => {
      this.logger.warn(`Worker error: ${data}`);
    });

    this.worker.on('error', (error) => {
      this.logger.error(`Worker ${this.workerID} error: ${error}`);
    });

    this.worker.on('close', (code, signal) => {
      this.logger.verbose(
        `Worker ${this.workerID} exited with code ${code} and signal ${signal}`,
      );
      this.purge();
    });

    const isReady = await this.waitReady();
    if (HasFailed(isReady)) {
      this.purge();
      return isReady;
    }

    const hasSent = this.sendToWorker({
      type: 'init',
      image,
      filetype,
      options: sharpOptions,
    });
    if (HasFailed(hasSent)) {
      this.purge();
      return hasSent;
    }

    this.logger.verbose(
      `Worker ${this.workerID} initialized with ${this.instance_timeout}ms timeout and ${this.memory_limit}MB memory limit`,
    );

    return true;
  }

  public operation<Operation extends SupportedSharpWorkerFunctions>(
    operation: Operation,
    ...parameters: Parameters<Sharp[Operation]>
  ): Failable<true> {
    if (!this.worker) {
      return Fail(FT.Internal, 'Worker is not initialized');
    }

    const hasSent = this.sendToWorker({
      type: 'operation',
      operation: {
        name: operation,
        parameters,
      } as SharpWorkerOperation,
    });
    if (HasFailed(hasSent)) {
      this.purge();
      return hasSent;
    }

    return true;
  }

  public async finish(
    targetFiletype: FileType,
    options?: SharpWorkerFinishOptions,
  ): AsyncFailable<SharpResult> {
    if (!this.worker) {
      return Fail(FT.Internal, 'Worker is not initialized');
    }

    const hasSent = this.sendToWorker({
      type: 'finish',
      filetype: targetFiletype,
      options: options ?? {},
    });
    if (HasFailed(hasSent)) {
      this.purge();
      return hasSent;
    }

    try {
      const finishPromise = new Promise<SharpWorkerResultMessage>(
        (resolve, reject) => {
          if (!this.worker) return reject('Worker is not initialized');

          this.worker.once('message', (message: SharpWorkerRecieveMessage) => {
            if (message.type === 'result') {
              resolve(message);
            } else reject('Unknown message type');
          });
          this.worker.once('close', () => reject('Worker closed'));
        },
      );

      const result = await pTimeout(finishPromise, {
        milliseconds: this.instance_timeout,
      });

      this.logger.verbose(
        `Worker ${this.workerID} finished in ${result.processingTime}ms`,
      );

      this.purge();

      return result.result;
    } catch (error) {
      this.purge();
      return Fail(FT.Internal, error);
    }
  }

  private async waitReady(): AsyncFailable<true> {
    try {
      const waitReadyPromise = new Promise<void>((resolve, reject) => {
        if (!this.worker) return reject('Worker is not initialized');

        this.worker.once('message', (message: SharpWorkerRecieveMessage) => {
          if (message.type === 'ready') resolve();
          else reject('Unknown message type');
        });
      });

      await pTimeout(waitReadyPromise, { milliseconds: this.instance_timeout });
      return true;
    } catch (error) {
      return Fail(FT.Internal, error);
    }
  }

  private sendToWorker(message: SharpWorkerSendMessage): Failable<true> {
    if (!this.worker) {
      return Fail(FT.Internal, 'Worker is not initialized');
    }

    this.worker.send(message);
    return true;
  }

  private purge() {
    this.worker?.kill();
    this.worker?.removeAllListeners();
    this.worker = null;
  }
}
