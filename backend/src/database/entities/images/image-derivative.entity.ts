import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne, PrimaryColumn, Unique
} from 'typeorm';
import { EImageBackend } from './image.entity';

@Entity()
@Unique(['image_id', 'key'])
export class EImageDerivativeBackend {
  @PrimaryColumn({ type: 'uuid', nullable: false, name: '_id' })
  @Index()
  fileKey: string;

  // == Reference to parent image
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

  // == Derivative options hash
  @Index()
  @Column({ nullable: false })
  key: string;

  // == Filetype of the derivative
  @Column({ nullable: false })
  filetype: string;

  // == Last time the derivative was read
  @Column({
    type: 'timestamptz',
    name: 'last_read',
    nullable: false,
  })
  last_read: Date;

  // == Binary data
  @Column({ type: 'bytea', nullable: true })
  data: Buffer | null;
}
