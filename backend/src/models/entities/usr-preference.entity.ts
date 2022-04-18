import { IsEntityID } from 'picsur-shared/dist/validators/entity-id.validator';
import { Column, Entity, Index, PrimaryGeneratedColumn, Unique } from 'typeorm';
import z from 'zod';

export const EUsrPreferenceSchema = z.object({
  id: IsEntityID().optional(),
  key: z.string(),
  value: z.string(),
  userId: IsEntityID(),
});
type EUsrPreference = z.infer<typeof EUsrPreferenceSchema>;

@Entity()
@Unique(['key', 'userId'])
export class EUsrPreferenceBackend implements EUsrPreference {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Index()
  @Column({ nullable: false })
  key: string;

  @Column({ nullable: false })
  value: string;

  @Index()
  @Column({ nullable: false })
  userId: string;
}
