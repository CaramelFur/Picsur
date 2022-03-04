import { SysPreferences } from 'picsur-shared/dist/dto/syspreferences.dto';
import { ESysPreference } from 'picsur-shared/dist/entities/syspreference.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ESysPreferenceBackend extends ESysPreference {
  @PrimaryGeneratedColumn()
  override id?: number;

  @Column({ unique: true })
  override key: SysPreferences;

  @Column()
  override value: string;
}
