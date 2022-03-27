import { ESysPreference } from 'picsur-shared/dist/entities/syspreference.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ESysPreferenceBackend extends ESysPreference {
  @PrimaryGeneratedColumn()
  override id?: number;

  @Column({ nullable: false, unique: true })
  override key: string;

  @Column({ nullable: false })
  override value: string;
}
