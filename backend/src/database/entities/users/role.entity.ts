import { ERole } from 'picsur-shared/dist/entities/role.entity';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import type { Permissions } from '../../../models/constants/permissions.const.js';

@Entity()
export class ERoleBackend implements ERole {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Index()
  @Column({ nullable: false, unique: true })
  name: string;

  @Column('text', { nullable: false, array: true })
  permissions: Permissions;
}
