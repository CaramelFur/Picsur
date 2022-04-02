import { IsNotEmpty, IsOptional } from 'class-validator';
import { EImage } from 'picsur-shared/dist/entities/image.entity';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EImageBackend extends EImage {
  @PrimaryGeneratedColumn('uuid')
  override id?: string;

  @Index()
  @Column({ unique: true, nullable: false })
  override hash: string;

  @Column({ nullable: false })
  override mime: string;

  // Binary data
  @Column({ type: 'bytea', nullable: false, select: false })
  @IsOptional()
  @IsNotEmpty()
  // @ts-ignore
  override data?: Buffer;
}
