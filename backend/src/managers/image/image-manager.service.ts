import { Injectable, Logger } from '@nestjs/common';
import { ImageEntryVariant } from 'picsur-shared/dist/dto/image-entry-variant.enum';
import { FileType } from 'picsur-shared/dist/dto/mimes.dto';
import { AsyncFailable, Fail, FT, HasFailed } from 'picsur-shared/dist/types';
import { FindResult } from 'picsur-shared/dist/types/find-result';
import { ParseFileType } from 'picsur-shared/dist/util/parse-mime';
import { ImageDBService } from '../../collections/image-db/image-db.service';
import { ImageFileDBService } from '../../collections/image-db/image-file-db.service';
import { EImageFileBackend } from '../../database/entities/images/image-file.entity';
import { EImageBackend } from '../../database/entities/images/image.entity';

@Injectable()
export class ImageManagerService {
  private readonly logger = new Logger(ImageManagerService.name);

  constructor(
    private readonly imagesService: ImageDBService,
    private readonly imageFilesService: ImageFileDBService,
  ) {}

  public async findOne(id: string): AsyncFailable<EImageBackend> {
    return await this.imagesService.findOne(id, undefined);
  }

  public async findMany(
    count: number,
    page: number,
    userid: string | undefined,
  ): AsyncFailable<FindResult<EImageBackend>> {
    return await this.imagesService.findMany(count, page, userid);
  }

  public async update(
    id: string,
    userid: string | undefined,
    options: Partial<Pick<EImageBackend, 'file_name' | 'expires_at'>>,
  ): AsyncFailable<EImageBackend> {
    if (options.expires_at !== undefined && options.expires_at !== null) {
      if (options.expires_at < new Date()) {
        return Fail(FT.UsrValidation, 'Expiration date must be in the future');
      }
    }
    return await this.imagesService.update(id, userid, options);
  }

  public async deleteMany(
    ids: string[],
    userid: string | undefined,
  ): AsyncFailable<EImageBackend[]> {
    return await this.imagesService.delete(ids, userid);
  }

  public async deleteWithKey(
    imageId: string,
    key: string,
  ): AsyncFailable<EImageBackend> {
    return await this.imagesService.deleteWithKey(imageId, key);
  }

  // File getters ==============================================================

  public async getMaster(imageId: string): AsyncFailable<EImageFileBackend> {
    return this.imageFilesService.getFile(imageId, ImageEntryVariant.MASTER);
  }

  public async getMasterFileType(imageId: string): AsyncFailable<FileType> {
    const mime = await this.imageFilesService.getFileTypes(imageId);
    if (HasFailed(mime)) return mime;

    if (mime['master'] === undefined)
      return Fail(FT.NotFound, 'No master file');

    return ParseFileType(mime['master']);
  }

  public async getOriginal(imageId: string): AsyncFailable<EImageFileBackend> {
    return this.imageFilesService.getFile(imageId, ImageEntryVariant.ORIGINAL);
  }

  public async getOriginalFileType(imageId: string): AsyncFailable<FileType> {
    const filetypes = await this.imageFilesService.getFileTypes(imageId);
    if (HasFailed(filetypes)) return filetypes;

    if (filetypes['original'] === undefined)
      return Fail(FT.NotFound, 'No original file');

    return ParseFileType(filetypes['original']);
  }

  public async getFileMimes(imageId: string): AsyncFailable<{
    [ImageEntryVariant.MASTER]: string;
    [ImageEntryVariant.ORIGINAL]: string | undefined;
  }> {
    const result = await this.imageFilesService.getFileTypes(imageId);
    if (HasFailed(result)) return result;

    if (result[ImageEntryVariant.MASTER] === undefined) {
      return Fail(FT.NotFound, 'No master file found');
    }

    return {
      [ImageEntryVariant.MASTER]: result[ImageEntryVariant.MASTER]!,
      [ImageEntryVariant.ORIGINAL]: result[ImageEntryVariant.ORIGINAL],
    };
  }
}
