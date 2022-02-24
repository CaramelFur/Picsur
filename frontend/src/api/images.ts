import { AsyncFailable, Fail } from 'imagur-shared/dist/types'

export function GetImageURL(image: string): string {
  const baseURL = window.location.protocol + '//' + window.location.host;

  return `${baseURL}/i/${image}`;
}

export function ValidateImageHash(hash: string): boolean {
  return /^[a-f0-9]{64}$/.test(hash);
}

export async function UploadImage(image: File): AsyncFailable<string> {
  const formData = new FormData();
  formData.append('image', image);

  let result = await fetch('/i', {
    method: 'POST',
    body: formData,
  }).then((res) => res.json());

  console.log(result);

  if (!result.hash) return Fail(result.error);

  return result.hash;
}
