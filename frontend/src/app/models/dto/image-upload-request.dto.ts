import { MultiPartRequest } from './multi-part-request.dto';

export class ImageUploadRequest implements MultiPartRequest {
  constructor(private image: File) {}

  public createFormData(): FormData {
    const data = new FormData();
    data.append('image', this.image);
    return data;
  }
}
