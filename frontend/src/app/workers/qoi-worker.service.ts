import { Injectable } from '@angular/core';
import { QOIImage, QOIJob, QOIWorkerOut } from './qoi-worker.dto';

@Injectable({
  providedIn: 'root',
})
export class QoiWorkerService {
  private worker: Worker | null = null;
  private job: Promise<QOIJob> | null = null;

  constructor() {
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker(new URL('./qoi.worker', import.meta.url));
    } else {
      this.job = import('./qoi.job').then((m) => m.default);
    }
  }

  public async decode(url: string): Promise<QOIImage> {
    if (this.worker && !this.job) {
      return new Promise((resolve, reject) => {
        const id = Date.now();
        const listener = ({ data }: { data: QOIWorkerOut }) => {
          if (data.id !== id) return;
          this.worker!.removeEventListener('message', listener);

          resolve({
            data: data.data,
            width: data.width,
            height: data.height,
          });
        };
        this.worker!.addEventListener('message', listener);
        this.worker!.postMessage({ id, url });
      });
    } else if (!this.worker && this.job) {
      const job = await this.job;
      return job(url);
    } else {
      throw new Error('No worker available');
    }
  }
}
