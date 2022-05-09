import { Inject, Injectable } from '@angular/core';
import { LOCATION, WINDOW } from '@ng-web-apis/common';
import {
  ImageDeleteRequest,
  ImageDeleteResponse,
  ImageListRequest,
  ImageListResponse,
  ImageUploadResponse,
} from 'picsur-shared/dist/dto/api/image-manage.dto';
import { ImageMetaResponse } from 'picsur-shared/dist/dto/api/image.dto';
import { ImageLinks } from 'picsur-shared/dist/dto/image-links.dto';
import { Mime2Ext } from 'picsur-shared/dist/dto/mimes.dto';
import { EImage } from 'picsur-shared/dist/entities/image.entity';
import { AsyncFailable } from 'picsur-shared/dist/types';
import { Fail, HasFailed, Open } from 'picsur-shared/dist/types/failable';
import { ImageUploadRequest } from '../../models/dto/image-upload-request.dto';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(
    private api: ApiService,
    @Inject(LOCATION) readonly location: Location,
  ) {}

  public async UploadImage(image: File): AsyncFailable<string> {
    const result = await this.api.postForm(
      ImageUploadResponse,
      '/api/image/upload',
      new ImageUploadRequest(image)
    );

    return Open(result, 'id');
  }

  public async GetImageMeta(image: string): AsyncFailable<ImageMetaResponse> {
    return await this.api.get(ImageMetaResponse, `/i/meta/${image}`);
  }

  public async ListImages(
    count: number,
    page: number,
    userID?: string
  ): AsyncFailable<ImageListResponse> {
    return await this.api.post(
      ImageListRequest,
      ImageListResponse,
      '/api/image/list',
      {
        count,
        page,
        user_id: userID,
      }
    );
  }

  public async DeleteImages(
    images: string[]
  ): AsyncFailable<ImageDeleteResponse> {
    return await this.api.post(
      ImageDeleteRequest,
      ImageDeleteResponse,
      '/api/image/delete',
      {
        ids: images,
      }
    );
  }

  public async DeleteImage(image: string): AsyncFailable<EImage> {
    const result = await this.DeleteImages([image]);
    if (HasFailed(result)) return result;

    if (result.images.length !== 1) {
      return Fail(
        `Image ${image} was not deleted, probably lacking permissions`
      );
    }

    return result.images[0];
  }

  // Non api calls

  public GetImageURL(image: string, mime: string | null): string {
    const baseURL = this.location.protocol + '//' + this.location.host;
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

  public CreateImageLinksFromID(
    imageID: string,
    mime: string | null
  ): ImageLinks {
    return this.CreateImageLinks(this.GetImageURL(imageID, mime));
  }
}
