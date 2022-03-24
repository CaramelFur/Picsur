import { IsEnum } from 'class-validator';
import { EImage } from 'picsur-shared/dist/entities/image.entity';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { SupportedMime, SupportedMimes } from '../dto/mimes.dto';

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

  @Column({ enum: SupportedMimes, nullable: false })
  @IsEnum(SupportedMimes)
  override mime: SupportedMime;
}
