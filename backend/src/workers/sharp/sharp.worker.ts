import { FileType } from 'picsur-shared/dist/dto/mimes.dto';
import { setrlimit } from 'posix.js';
import { Sharp } from 'sharp';
import {
  SharpWorkerFinishOptions,
  SharpWorkerInitMessage,
  SharpWorkerOperationMessage,
  SharpWorkerRecieveMessage,
  SharpWorkerSendMessage,
} from './sharp.message.js';
import { UniversalSharpIn, UniversalSharpOut } from './universal-sharp.js';

export class SharpWorker {
  private startTime = 0;
  private sharpi: Sharp | null = null;

  constructor() {
    this.setup();
  }

  private setup() {
    if (process.send === undefined) {
      return this.purge('This is not a worker process');
    }

    const memoryLimit = parseInt(process.env['MEMORY_LIMIT_MB'] ?? '');

    if (isNaN(memoryLimit) || memoryLimit <= 0) {
      return this.purge('MEMORY_LIMIT_MB environment variable is not set');
    }

    try {
      setrlimit('data', {
        soft: 1000 * 1000 * memoryLimit,
        hard: 1000 * 1000 * memoryLimit,
      });
    } catch (e) {
      console.warn('Failed to set memory limit');
    }

    process.on('message', this.messageHandler.bind(this));

    this.sendMessage({
      type: 'ready',
    });
  }

  private messageHandler(message: SharpWorkerSendMessage): void {
    if (message.type === 'init') {
      this.init(message);
    } else if (message.type === 'operation') {
      this.operation(message);
    } else if (message.type === 'finish') {
      this.finish(message.filetype, message.options);
    } else {
      return this.purge('Unknown message type');
    }
  }

  private init(message: SharpWorkerInitMessage): void {
    if (this.sharpi !== null) {
      return this.purge('Already initialized');
    }

    this.startTime = Date.now();
    this.sharpi = UniversalSharpIn(
      message.image,
      message.filetype,
      message.options,
    );
  }

  private operation(message: SharpWorkerOperationMessage): void {
    if (this.sharpi === null) {
      return this.purge('Not initialized');
    }

    const operation = message.operation;
    message.operation.parameters;

    this.sharpi = (this.sharpi[operation.name] as any)(...operation.parameters);
  }

  private async finish(
    filetype: FileType,
    options: SharpWorkerFinishOptions,
  ): Promise<void> {
    if (this.sharpi === null) {
      return this.purge('Not initialized');
    }

    const sharpi = this.sharpi;
    this.sharpi = null;

    try {
      const result = await UniversalSharpOut(sharpi, filetype, options);
      const processingTime = Date.now() - this.startTime;

      this.sendMessage({
        type: 'result',
        processingTime,
        result,
      });
    } catch (e) {
      return this.purge(e);
    }
  }

  private sendMessage(message: SharpWorkerRecieveMessage): void {
    if (process.send === undefined) {
      return this.purge('This is not a worker process');
    }

    process.send(message);
  }

  private purge(reason: any): void {
    if (typeof reason === 'string') {
      console.error(new Error(reason));
    } else {
      console.error(reason);
    }
    process.exit(1);
  }
}

new SharpWorker();
