import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform
} from '@nestjs/common';
import { Ext2Mime } from 'picsur-shared/dist/dto/mimes.dto';
import { UUIDRegex } from 'picsur-shared/dist/util/common-regex';
import { ImageFullId } from '../../models/constants/image-full-id.const';

@Injectable()
export class ImageFullIdPipe implements PipeTransform<string, ImageFullId> {
  transform(value: string, metadata: ArgumentMetadata): ImageFullId {
    const split = value.split('.');
    if (split.length !== 2)
      throw new BadRequestException('Invalid image identifier');

    const [id, ext] = split;
    if (!UUIDRegex.test(id))
      throw new BadRequestException('Invalid image identifier');

    const mime = Ext2Mime(ext);

    if (mime === undefined)
      throw new BadRequestException('Invalid image identifier');

    return { id, ext, mime };
  }
}
