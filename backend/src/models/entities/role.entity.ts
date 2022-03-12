import { Permissions } from 'picsur-shared/dist/dto/permissions';
import { ERole } from 'picsur-shared/dist/entities/role.entity';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ERoleBackend extends ERole {
  @PrimaryGeneratedColumn()
  override id?: number;

  @Index()
  @Column({ nullable: false, unique: true })
  override name: string;

  @Column('text', { nullable: false, array: true })
  override permissions: Permissions;
}
