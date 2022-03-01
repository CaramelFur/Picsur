import { Exclude } from 'class-transformer';
import {
  IsDefined,
  IsEnum,
  IsHash,
  IsOptional,
} from 'class-validator';
//import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { SupportedMime, SupportedMimes } from '../dto/mimes.dto';

//@Entity()
export class EImage {
  // @PrimaryGeneratedColumn()
  @IsOptional()
  id?: number;

  // @Index()
  // @Column({ unique: true })
  @IsHash('sha256')
  hash: string;

  // Binary data
  // @Column({ type: 'bytea', nullable: false, select: false })
  @IsOptional()
  @Exclude()
  data?: Buffer;

  // @Column({ enum: SupportedMimes })
  @IsEnum(SupportedMimes)
  @IsDefined()
  mime: SupportedMime;
}
