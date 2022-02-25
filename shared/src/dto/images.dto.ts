import { IsHash, IsString } from 'class-validator';

export class ImageUploadResponse {
  @IsString()
  @IsHash('sha256')
  hash: string;
}
