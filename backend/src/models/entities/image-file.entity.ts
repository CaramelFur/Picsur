import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { ImageFileType } from '../constants/image-file-types.const';

@Entity()
export class EImageFileBackend {
  @PrimaryGeneratedColumn('uuid')
  private _id?: string;

  @Column({ nullable: false })
  @Index()
  imageId: string;

  @Column({ nullable: false, enum: ImageFileType })
  @Index()
  type: ImageFileType;

  @Column({ nullable: false })
  mime: string;

  // Binary data
  @Column({ type: 'bytea', nullable: false })
  data: Buffer;
}
