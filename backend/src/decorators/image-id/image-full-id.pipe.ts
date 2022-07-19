import {
  ArgumentMetadata, Injectable,
  PipeTransform
} from '@nestjs/common';
import { Ext2Mime } from 'picsur-shared/dist/dto/mimes.dto';
import { Fail, FT } from 'picsur-shared/dist/types';
import { UUIDRegex } from 'picsur-shared/dist/util/common-regex';
import { ImageFullId } from '../../models/constants/image-full-id.const';

@Injectable()
export class ImageFullIdPipe implements PipeTransform<string, ImageFullId> {
  transform(value: string, metadata: ArgumentMetadata): ImageFullId {
    const split = value.split('.');
    if (split.length === 2) {
      const [id, ext] = split;
      if (!UUIDRegex.test(id))
        throw Fail(FT.UsrValidation, 'Invalid image identifier');

      const mime = Ext2Mime(ext);

      if (mime === undefined)
        throw Fail(FT.UsrValidation, 'Invalid image identifier');

      return { type: 'normal', id, ext, mime };
    } else if (split.length === 1) {
      const [id] = split;

      if (!UUIDRegex.test(id))
        throw Fail(FT.UsrValidation, 'Invalid image identifier');

      return { type: 'original', id, ext: null, mime: null };
    } else {
      throw Fail(FT.UsrValidation, 'Invalid image identifier');
    }
  }
}
