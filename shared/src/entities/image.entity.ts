import { IsDefined, IsEnum, IsHash, IsNumber, IsOptional, IsString } from 'class-validator';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { SupportedMime, SupportedMimes } from '../dto/mimes.dto';

@Entity()
export class EImage {
  @PrimaryGeneratedColumn()
  @IsNumber()
  @IsDefined()
  id: number;

  @Index()
  @Column({ unique: true })
  @IsString()
  @IsHash('sha256')
  hash: string;

  // Binary data
  @Column({ type: 'bytea', nullable: false, select: false })
  @IsOptional()
  data?: Buffer;

  @Column({ enum: SupportedMimes })
  @IsEnum(SupportedMimes)
  @IsDefined()
  mime: SupportedMime;
}
