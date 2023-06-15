import { IsEntityID } from 'picsur-shared/dist/validators/entity-id.validator';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import * as z from 'zod';

export const ESysPreferenceSchema = z.object({
  id: IsEntityID().optional(),
  key: z.string(),
  value: z.string(),
});
type ESysPreference = z.infer<typeof ESysPreferenceSchema>;

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
