import { ESysPreference } from 'picsur-shared/dist/entities/syspreference.entity';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ESysPreferenceBackend extends ESysPreference {
  @PrimaryGeneratedColumn("uuid")
  override id: string;

  @Index()
  @Column({ nullable: false, unique: true })
  override key: string;

  @Column({ nullable: false })
  override value: string;
}
