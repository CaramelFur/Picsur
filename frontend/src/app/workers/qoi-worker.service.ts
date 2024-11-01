import { Injectable } from '@angular/core';
import {
  AsyncFailable,
  Failure,
  HasFailed,
} from 'picsur-shared/dist/types/failable';
import { v4 as uuidv4 } from 'uuid';
import { KeyStorageService } from '../services/storage/key-storage.service';
import { QOIImage, QOIJob, QOIWorkerOut } from './qoi-worker.dto';

@Injectable({
  providedIn: 'root',
})
export class QoiWorkerService {
  private worker: Worker | null = null;
  private job: Promise<QOIJob> | null = null;

  constructor(private readonly keyService: KeyStorageService) {
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker(new URL('./qoi.worker', import.meta.url));
    } else {
      this.job = import('./qoi.job').then((m) => m.default);
    }
  }

  public async decode(url: string): AsyncFailable<QOIImage> {
    const authorization = 'Bearer ' + (this.keyService.get() ?? '');

    if (this.worker && !this.job) {
      return new Promise((resolve) => {
        const id = uuidv4().toString();
        const listener = ({ data }: { data: QOIWorkerOut }) => {
          if (data.id !== id) return;
          this.worker?.removeEventListener('message', listener);

          let result = data.result;

          if (HasFailed(result)) result = Failure.deserialize(data.result);
          resolve(result);
        };
        this.worker?.addEventListener('message', listener);
        this.worker?.postMessage({ id, url, authorization });
      });
    } else if (!this.worker && this.job) {
      const job = await this.job;
      return job(url, authorization);
    } else {
      throw new Error('No worker available');
    }
  }
}
