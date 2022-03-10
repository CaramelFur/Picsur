import { Roles } from 'picsur-shared/dist/dto/roles.dto';
import { EUser } from 'picsur-shared/dist/entities/user.entity';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

// Different data for public and private

@Entity()
export class EUserBackend extends EUser {
  @PrimaryGeneratedColumn()
  override id?: number;

  @Index()
  @Column({ nullable: false, unique: true })
  override username: string;

  @Column('text', { nullable: false, array: true })
  override roles: Roles;

  @Column({ nullable: false, select: false })
  override password?: string;
}
