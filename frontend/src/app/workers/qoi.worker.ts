/// <reference lib="webworker" />

import qoiDecodeJob from './qoi.job';

addEventListener('message', async (msg) => {
  const { id, url } = msg.data;
  if (!id || !url) {
    throw new Error('Invalid message');
  }

  const result = await qoiDecodeJob(url);

  postMessage({
    id,
    ...result,
  });
});
