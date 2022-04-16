/// <reference lib="webworker" />

import { QOIWorkerIn, QOIWorkerOut } from './qoi-worker.dto';
import qoiDecodeJob from './qoi.job';

addEventListener('message', async (msg) => {
  const { id, url } = msg.data as QOIWorkerIn;
  if (!id || !url) {
    throw new Error('Invalid message');
  }

  const result = await qoiDecodeJob(url);

  const returned: QOIWorkerOut = {
    id,
    ...result,
  };

  postMessage(returned);
});
