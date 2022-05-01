import { Logger } from '@nestjs/common';
import { ChildProcess, fork } from 'child_process';
import pTimeout from 'p-timeout';
import path from 'path';
import { FullMime } from 'picsur-shared/dist/dto/mimes.dto';
import {
  AsyncFailable,
  Fail,
  Failable,
  HasFailed
} from 'picsur-shared/dist/types';
import { Sharp } from 'sharp';
import {
  SharpWorkerFinishOptions,
  SharpWorkerOperation,
  SharpWorkerRecieveMessage,
  SharpWorkerResultMessage,
  SharpWorkerSendMessage,
  SupportedSharpWorkerFunctions
} from './sharp/sharp.message';
import { SharpResult } from './sharp/universal-sharp';

const moduleURL = new URL(import.meta.url);
const __dirname = path.dirname(moduleURL.pathname);

export class SharpWrapper {
  private readonly workerID: number = Math.floor(Math.random() * 100000);
  private readonly logger: Logger = new Logger('SharpWrapper' + this.workerID);

  private static readonly WORKER_PATH = path.join(
    __dirname,
    './sharp',
    'sharp.worker.js',
  );

  private worker: ChildProcess | null = null;

  constructor(private instance_timeout: number, private memory_limit: number) {}

  public async start(image: Buffer, mime: FullMime): AsyncFailable<true> {
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
      mime,
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
      return Fail('Worker is not initialized');
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
    targetMime: FullMime,
    options?: SharpWorkerFinishOptions,
  ): AsyncFailable<SharpResult> {
    if (!this.worker) {
      return Fail('Worker is not initialized');
    }

    const hasSent = this.sendToWorker({
      type: 'finish',
      mime: targetMime,
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

      const result = await pTimeout(finishPromise, this.instance_timeout);

      this.logger.verbose(
        `Worker ${this.workerID} finished in ${result.processingTime}ms`,
      );

      this.purge();

      return result.result;
    } catch (error) {
      this.purge();
      return Fail(error);
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

      await pTimeout(waitReadyPromise, this.instance_timeout);
      return true;
    } catch (error) {
      return Fail(error);
    }
  }

  private sendToWorker(message: SharpWorkerSendMessage): Failable<true> {
    if (!this.worker) {
      return Fail('Worker is not initialized');
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
