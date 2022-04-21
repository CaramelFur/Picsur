/// <reference lib="webworker" />

import { QOIWorkerIn, QOIWorkerOut } from './qoi-worker.dto';
import qoiDecodeJob from './qoi.job';

addEventListener('message', async (msg) => {
  const { id, url, authorization } = msg.data as QOIWorkerIn;

  if (!id || !url || !authorization) {
    throw new Error('Invalid message');
  }

  const result = await qoiDecodeJob(url, authorization);

  const returned: QOIWorkerOut = {
    id,
    result,
  };

  postMessage(returned);
});
