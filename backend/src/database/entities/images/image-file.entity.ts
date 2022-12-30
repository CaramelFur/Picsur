import { ImageEntryVariant } from 'picsur-shared/dist/dto/image-entry-variant.enum';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn, Unique
} from 'typeorm';
import { EImageBackend } from './image.entity';

@Entity()
@Unique(['image_id', 'variant'])
export class EImageFileBackend {
  @PrimaryColumn({ type: 'uuid', nullable: false, name: '_id' })
  @Index()
  fileKey: string;

  // == Reference to parent image
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

  // == File variant
  @Index()
  @Column({ nullable: false, enum: ImageEntryVariant })
  variant: ImageEntryVariant;

  // == Filetype of the derivative
  @Column({ nullable: false })
  filetype: string;

  // == Binary data
  @Column({ type: 'bytea', nullable: true })
  data: Buffer | null;
}
