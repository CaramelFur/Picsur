import { AsyncFailable, Fail } from 'picsur-shared/dist/types';
import { QOIdecodeJS } from '../util/qoi/qoi-decode';
import { QOIImage } from './qoi-worker.dto';

export default async function qoiDecodeJob(
  url: string,
  authorization: string
): AsyncFailable<QOIImage> {
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: authorization,
      },
    });
    if (!response.ok) {
      return Fail('Could not fetch image');
    }

    const buffer = await response.arrayBuffer();

    const image = QOIdecodeJS(buffer, null, null, 4);

    const imageData = new ImageData(
      new Uint8ClampedArray(image.data.buffer),
      image.width,
      image.height
    );

    return {
      data: imageData,
      width: image.width,
      height: image.height,
    };
  } catch (e) {
    return Fail(e);
  }
}
