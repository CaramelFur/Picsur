import { ESysPreference } from 'picsur-shared/dist/entities/syspreference.entity';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ESysPreferenceBackend implements ESysPreference {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Index()
  @Column({ nullable: false, unique: true })
  key: string;

  @Column({ nullable: false })
  value: string;
}
