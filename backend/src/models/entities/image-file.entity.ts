import { ImageFileType } from 'picsur-shared/dist/dto/image-file-types.enum';
import { Column, Entity, Index, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['image_id', 'type'])
export class EImageFileBackend {
  @PrimaryGeneratedColumn('uuid')
  private _id?: string;

  @Index()
  @Column({ nullable: false })
  image_id: string;

  @Index()
  @Column({ nullable: false, enum: ImageFileType })
  type: ImageFileType;

  @Column({ nullable: false })
  mime: string;

  // Binary data
  @Column({ type: 'bytea', nullable: false })
  data: Buffer;
}
