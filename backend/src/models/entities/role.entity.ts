import { ERole } from 'picsur-shared/dist/entities/role.entity';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { Permissions } from '../dto/permissions.dto';

@Entity()
export class ERoleBackend extends ERole {
  @PrimaryGeneratedColumn("uuid")
  override id?: string;

  @Index()
  @Column({ nullable: false, unique: true })
  override name: string;

  @Column('text', { nullable: false, array: true })
  override permissions: Permissions;
}
