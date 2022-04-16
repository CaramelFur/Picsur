import { QOIdecodeJS } from '../util/qoi/qoi-decode';
import { QOIImage } from './qoi-worker.dto';

export default async function qoiDecodeJob(url: string): Promise<QOIImage> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${url}`);
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
}