import { Injectable } from '@angular/core';
import {
  ImageMetaResponse,
  ImageUploadResponse
} from 'picsur-shared/dist/dto/api/image.dto';
import { ImageLinks } from 'picsur-shared/dist/dto/image-links.dto';
import { Mime2Ext } from 'picsur-shared/dist/dto/mimes.dto';
import { AsyncFailable } from 'picsur-shared/dist/types';
import { Open } from 'picsur-shared/dist/types/failable';
import { ImageUploadRequest } from '../../models/dto/image-upload-request.dto';
import { ApiService } from './api.service';
@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(private api: ApiService) {}

  public async UploadImage(image: File): AsyncFailable<string> {
    const result = await this.api.postForm(
      ImageUploadResponse,
      '/i',
      new ImageUploadRequest(image)
    );

    return Open(result, 'id');
  }

  public async GetImageMeta(image: string): AsyncFailable<ImageMetaResponse> {
    return await this.api.get(ImageMetaResponse, `/i/meta/${image}`);
  }

  public GetImageURL(image: string, mime: string | null): string {
    const baseURL = window.location.protocol + '//' + window.location.host;
    const extension = mime !== null ? Mime2Ext(mime) ?? 'error' : null;

    return `${baseURL}/i/${image}${extension !== null ? '.' + extension : ''}`;
  }

  public CreateImageLinks(imageURL: string): ImageLinks {
    return {
      source: imageURL,
      markdown: `![image](${imageURL})`,
      html: `<img src="${imageURL}" alt="image">`,
      rst: `.. image:: ${imageURL}`,
      bbcode: `[img]${imageURL}[/img]`,
    };
  }

  public CreateImageLinksFromID(imageID: string, mime: string | null): ImageLinks {
    return this.CreateImageLinks(this.GetImageURL(imageID, mime));
  }
}
