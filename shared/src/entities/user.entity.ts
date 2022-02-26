import {
  IsBoolean,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EUser {
  @PrimaryGeneratedColumn()
  @IsNumber()
  @IsDefined()
  id: number;

  @Index()
  @Column({ unique: true })
  @IsString()
  @IsNotEmpty()
  username: string;

  @Column({ default: false })
  @IsDefined()
  @IsBoolean()
  isAdmin: boolean;

  @Column({ select: false })
  @IsOptional()
  @IsString()
  password?: string;
}
