import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { SupportedMime, SupportedMimes } from './mimes.service';

@Entity()
export class ImageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ unique: true })
  hash: string;

  // Binary data
  @Column({ type: 'bytea', nullable: false })
  data: Buffer;

  @Column({ enum: SupportedMimes })
  mime: SupportedMime;
}
