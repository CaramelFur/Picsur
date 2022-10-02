import { ImageEntryVariant } from 'picsur-shared/dist/dto/image-entry-variant.enum';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Unique,
} from 'typeorm';
import { EImageBackend } from './image.entity';

@Entity()
@Unique(['image_id', 'variant'])
export class EImageFileBackend {
  @PrimaryColumn({ type: 'uuid', nullable: false })
  @Index()
  s3key: string;

  // We do a little trickery
  @Index()
  @ManyToOne(() => EImageBackend, (image) => image.files, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'image_id' })
  private _image?: any;

  @Column({
    name: 'image_id',
    nullable: true,
  })
  image_id: string | null;

  @Index()
  @Column({ nullable: false, enum: ImageEntryVariant })
  variant: ImageEntryVariant;

  @Column({ nullable: false })
  filetype: string;
}
