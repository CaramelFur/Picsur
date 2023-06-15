import { MultiPartRequest } from './multi-part-request.dto';

export class ImagesUploadRequest implements MultiPartRequest {
  constructor(private images: File[]) {}

  public createFormData(): FormData {
    const data = new FormData();
    for (let i = 0; i < this.images.length; i++) {
      data.append(`images[${i}]`, this.images[i]);
    }
    return data;
  }
}
