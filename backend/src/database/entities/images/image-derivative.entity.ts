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
@Unique(['image_id', 'key'])
export class EImageDerivativeBackend {
  @PrimaryColumn({ type: 'uuid', nullable: false })
  @Index()
  s3key: string;

  // We do a little trickery
  @Index()
  @ManyToOne(() => EImageBackend, (image) => image.derivatives, {
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
  @Column({ nullable: false })
  key: string;

  @Column({ nullable: false })
  filetype: string;

  @Column({
    type: 'timestamptz',
    name: 'last_read',
    nullable: false,
  })
  last_read: Date;
}
