import { EUser } from 'picsur-shared/dist/entities/user.entity';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

// Different data for public and private

@Entity()
export class EUserBackend extends EUser {
  @PrimaryGeneratedColumn()
  override id?: number;

  @Index()
  @Column({ unique: true })
  override username: string;

  @Column({ default: false })
  override isAdmin: boolean;

  @Column({ select: false })
  override password?: string;
}
