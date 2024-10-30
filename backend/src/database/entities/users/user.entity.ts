import { EUserSchema } from 'picsur-shared/dist/entities/user.entity';
import {
    Column,
    Entity,
    Index,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { z } from 'zod';
import { EApiKeyBackend } from '../apikey.entity.js';
import { EUsrPreferenceBackend } from '../system/usr-preference.entity.js';

// Different data for public and private
const OverriddenEUserSchema = EUserSchema.omit({ hashedPassword: true }).merge(
  z.object({
    hashedPassword: z.string().optional(),
  }),
);
type OverriddenEUser = z.infer<typeof OverriddenEUserSchema>;

@Entity()
export class EUserBackend implements OverriddenEUser {
  @PrimaryGeneratedColumn('uuid', {})
  id: string;

  @Index()
  @Column({ nullable: false, unique: true })
  username: string;

  @Column('text', { nullable: false, array: true })
  roles: string[];

  @Column({ nullable: false, select: false })
  hashed_password?: string;

  // This will never be populated, it is only here to auto delete apikeys when a user is deleted
  @OneToMany(() => EApiKeyBackend, (apikey) => apikey.user)
  apikeys?: EApiKeyBackend[];

  @OneToMany(() => EUsrPreferenceBackend, (pref) => pref.user_id)
  preferences?: EUsrPreferenceBackend[];
}
