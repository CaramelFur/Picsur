import { Injectable } from '@angular/core';
import { ImageMetaResponse } from 'picsur-shared/dist/dto/api/image.dto';
import { EImage } from 'picsur-shared/dist/entities/image.entity';
import { AsyncFailable, HasFailed } from 'picsur-shared/dist/types';
import { ImageUploadRequest } from '../../models/image-upload-request';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(private api: ApiService) {}

  public async UploadImage(image: File): AsyncFailable<string> {
    const result = await this.api.postForm(
      ImageMetaResponse,
      '/i',
      new ImageUploadRequest(image)
    );

    if (HasFailed(result)) return result;

    return result.hash;
  }

  public async GetImageMeta(image: string): AsyncFailable<EImage> {
    return await this.api.get(ImageMetaResponse, `/i/meta/${image}`);
  }

  public GetImageURL(image: string): string {
    const baseURL = window.location.protocol + '//' + window.location.host;

    return `${baseURL}/i/${image}`;
  }

  public CreateImageLinks(imageURL: string) {
    return {
      source: imageURL,
      markdown: `![image](${imageURL})`,
      html: `<img src="${imageURL}" alt="image">`,
      rst: `.. image:: ${imageURL}`,
      bbcode: `[img]${imageURL}[/img]`,
    };
  }
}
