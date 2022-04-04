import { EUsrPreference } from 'picsur-shared/dist/entities/usrpreference';
import { Column, Index, PrimaryGeneratedColumn } from 'typeorm';

export class EUsrPreferenceBackend implements EUsrPreference {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Index()
  @Column({ nullable: false, unique: true })
  key: string;

  @Column({ nullable: false })
  value: string;

  @Index()
  @Column({ nullable: false })
  userId: number;
}
