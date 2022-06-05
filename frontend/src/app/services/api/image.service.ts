import { Inject, Injectable } from '@angular/core';
import { LOCATION } from '@ng-web-apis/common';
import {
  ImageDeleteRequest,
  ImageDeleteResponse,
  ImageListRequest,
  ImageListResponse,
  ImageUploadResponse
} from 'picsur-shared/dist/dto/api/image-manage.dto';
import {
  ImageMetaResponse,
  ImageRequestParams
} from 'picsur-shared/dist/dto/api/image.dto';
import { ImageLinks } from 'picsur-shared/dist/dto/image-links.dto';
import { Mime2Ext } from 'picsur-shared/dist/dto/mimes.dto';
import { EImage } from 'picsur-shared/dist/entities/image.entity';
import { AsyncFailable } from 'picsur-shared/dist/types';
import { Fail, HasFailed, Open } from 'picsur-shared/dist/types/failable';
import { ImageUploadRequest } from '../../models/dto/image-upload-request.dto';
import { ApiService } from './api.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(
    private api: ApiService,
    @Inject(LOCATION) readonly location: Location,

    private userService: UserService,
  ) {}

  public async UploadImage(image: File): AsyncFailable<string> {
    const result = await this.api.postForm(
      ImageUploadResponse,
      '/api/image/upload',
      new ImageUploadRequest(image),
    );

    return Open(result, 'id');
  }

  public async GetImageMeta(image: string): AsyncFailable<ImageMetaResponse> {
    return await this.api.get(ImageMetaResponse, `/i/meta/${image}`);
  }

  public async ListAllImages(
    count: number,
    page: number,
    userID?: string,
  ): AsyncFailable<ImageListResponse> {
    return await this.api.post(
      ImageListRequest,
      ImageListResponse,
      '/api/image/list',
      {
        count,
        page,
        user_id: userID,
      },
    );
  }

  public async ListMyImages(
    count: number,
    page: number,
  ): AsyncFailable<ImageListResponse> {
    const userID = await this.userService.snapshot?.id;
    if (userID === undefined) {
      return Fail('User not logged in');
    }

    return await this.ListAllImages(count, page, userID);
  }

  public async DeleteImages(
    images: string[],
  ): AsyncFailable<ImageDeleteResponse> {
    return await this.api.post(
      ImageDeleteRequest,
      ImageDeleteResponse,
      '/api/image/delete',
      {
        ids: images,
      },
    );
  }

  public async DeleteImage(image: string): AsyncFailable<EImage> {
    const result = await this.DeleteImages([image]);
    if (HasFailed(result)) return result;

    if (result.images.length !== 1) {
      return Fail(
        `Image ${image} was not deleted, probably lacking permissions`,
      );
    }

    return result.images[0];
  }

  // Non api calls

  public GetImageURL(image: string, mime: string | null): string {
    const baseURL = this.location.protocol + '//' + this.location.host;
    const extension = mime !== null ? Mime2Ext(mime) : null;

    return `${baseURL}/i/${image}${extension !== null ? '.' + extension : ''}`;
  }

  public GetImageURLCustomized(
    image: string,
    mime: string | null,
    options: ImageRequestParams,
  ): string {
    const baseURL = this.GetImageURL(image, mime);
    const betterOptions = ImageRequestParams.zodSchema.safeParse(options);

    if (!betterOptions.success) return baseURL;

    let queryParams: string[] = [];

    if (options.height !== undefined)
      queryParams.push(`height=${options.height}`);
    if (options.width !== undefined) queryParams.push(`width=${options.width}`);
    if (options.rotate !== undefined)
      queryParams.push(`rotate=${options.rotate}`);
    if (options.flipx !== undefined) queryParams.push(`flipx=${options.flipx}`);
    if (options.flipy !== undefined) queryParams.push(`flipy=${options.flipy}`);
    if (options.greyscale !== undefined)
      queryParams.push(`greyscale=${options.greyscale}`);
    if (options.noalpha !== undefined)
      queryParams.push(`noalpha=${options.noalpha}`);
    if (options.negative !== undefined)
      queryParams.push(`negative=${options.negative}`);
    if (options.quality !== undefined)
      queryParams.push(`quality=${options.quality}`);

    if (queryParams.length === 0) return baseURL;

    return baseURL + '?' + queryParams.join('&');
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
    mime: string | null,
  ): ImageLinks {
    return this.CreateImageLinks(this.GetImageURL(imageID, mime));
  }
}
