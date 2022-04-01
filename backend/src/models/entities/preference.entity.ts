import { EUsrPreference } from 'picsur-shared/dist/entities/usrpreference';
import { Column, Index, PrimaryGeneratedColumn } from 'typeorm';

export class EUsrPreferenceBackend extends EUsrPreference {
  @PrimaryGeneratedColumn()
  override id?: number;

  @Index()
  @Column({ nullable: false, unique: true })
  override key: string;

  @Column({ nullable: false })
  override value: string;

  @Index()
  @Column({ nullable: false })
  override userId: number;
}
