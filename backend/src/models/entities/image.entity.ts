import { EImage } from 'picsur-shared/dist/entities/image.entity';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EImageBackend extends EImage {
  @PrimaryGeneratedColumn()
  override id?: number;

  @Index()
  @Column({ unique: true, nullable: false })
  override hash: string;

  // Binary data
  @Column({ type: 'bytea', nullable: false, select: false })
  override data?: Buffer;

  @Column({ nullable: false })
  override mime: string;
}
