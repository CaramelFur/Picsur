import { ImageEntryVariant } from 'picsur-shared/dist/dto/image-entry-variant.enum';
import { Column, Entity, Index, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['image_id', 'variant'])
export class EImageFileBackend {
  @PrimaryGeneratedColumn('uuid')
  private _id?: string;

  @Index()
  @Column({ nullable: false })
  image_id: string;

  @Index()
  @Column({ nullable: false, enum: ImageEntryVariant })
  variant: ImageEntryVariant;

  @Column({ nullable: false })
  filetype: string;

  // Binary data
  @Column({ type: 'bytea', nullable: false })
  data: Buffer;
}
