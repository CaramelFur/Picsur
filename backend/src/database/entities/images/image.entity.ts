import { EImage } from 'picsur-shared/dist/entities/image.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EImageDerivativeBackend } from './image-derivative.entity.js';
import { EImageFileBackend } from './image-file.entity.js';

@Entity()
export class EImageBackend implements EImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    type: 'uuid',
  })
  user_id: string;

  @Column({
    type: 'timestamptz',
    nullable: false,
  })
  created: Date;

  @Column({
    nullable: false,
    default: 'image',
  })
  file_name: string;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  expires_at: Date | null;

  @Column({
    nullable: true,
    select: false,
  })
  delete_key?: string;

  @OneToMany(() => EImageDerivativeBackend, (derivative) => derivative.image_id)
  derivatives: EImageDerivativeBackend[];

  @OneToMany(() => EImageFileBackend, (file) => file.image_id)
  files: EImageFileBackend[];
}
