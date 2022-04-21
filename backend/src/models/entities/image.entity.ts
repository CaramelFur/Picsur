import { EImage } from 'picsur-shared/dist/entities/image.entity';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EImageBackend implements EImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
