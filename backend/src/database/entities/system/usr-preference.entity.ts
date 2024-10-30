import { IsEntityID } from 'picsur-shared/dist/validators/entity-id.validator';
import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import * as z from 'zod';
import { EUserBackend } from '../users/user.entity.js';

export const EUsrPreferenceSchema = z.object({
  id: IsEntityID().optional(),
  key: z.string(),
  value: z.string(),
  user_id: IsEntityID(),
});
type EUsrPreference = z.infer<typeof EUsrPreferenceSchema>;

@Entity()
@Unique(['key', 'user_id'])
export class EUsrPreferenceBackend implements EUsrPreference {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Index()
  @Column({ nullable: false })
  key: string;

  @Column({ nullable: false })
  value: string;

  // We do a little trickery
  @Index()
  @ManyToOne(() => EUserBackend, (user) => user.preferences, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  private _user?: any;

  @Column({
    name: 'user_id',
  })
  user_id: string;
}
