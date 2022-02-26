import { Exclude, Expose } from 'class-transformer';
import {
  IsDefined,
  IsEmpty,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

// Different data for public and private

@Entity()
export class EUser {
  @PrimaryGeneratedColumn()
  @IsOptional()
  id?: number;

  @Index()
  @Column({ unique: true })
  @IsNotEmpty()
  username: string;

  @Column({ default: false })
  @IsDefined()
  isAdmin: boolean;

  @Column({ select: false })
  @IsOptional()
  @Exclude()
  password?: string;
}
