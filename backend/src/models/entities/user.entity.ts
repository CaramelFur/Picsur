import { IsOptional, IsString } from 'class-validator';
import { EUser } from 'picsur-shared/dist/entities/user.entity';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

// Different data for public and private

@Entity()
export class EUserBackend extends EUser {
  @PrimaryGeneratedColumn("uuid")
  override id?: string;

  @Index()
  @Column({ nullable: false, unique: true })
  override username: string;

  @Column('text', { nullable: false, array: true })
  override roles: string[];

  @Column({ nullable: false, select: false })
  @IsOptional()
  @IsString()
  // @ts-ignore
  override hashedPassword?: string;
}

