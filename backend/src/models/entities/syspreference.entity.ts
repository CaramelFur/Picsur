import { ESysPreference } from 'picsur-shared/dist/entities/syspreference.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ESysPreferenceBackend extends ESysPreference {
  @PrimaryGeneratedColumn()
  override id?: number;

  @Column()
  override name: string;

  @Column()
  override value: string;
}
