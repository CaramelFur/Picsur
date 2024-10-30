import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import { EImageBackend } from './image.entity.js';

@Entity()
@Unique(['image_id', 'key'])
export class EImageDerivativeBackend {
  @PrimaryGeneratedColumn('uuid')
  private _id?: string;

  // We do a little trickery
  @Index()
  @ManyToOne(() => EImageBackend, (image) => image.derivatives, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'image_id' })
  private _image?: any;

  @Column({
    name: 'image_id',
  })
  image_id: string;

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

  // Binary data
  @Column({ type: 'bytea', nullable: false })
  data: Buffer;
}
