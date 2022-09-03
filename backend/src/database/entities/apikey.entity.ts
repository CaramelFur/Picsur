import { EApiKeySchema } from 'picsur-shared/dist/entities/apikey.entity';
import {
  Column, Entity,
  ManyToOne,
  PrimaryColumn
} from 'typeorm';
import { z } from 'zod';
import { EUserBackend } from './user.entity';

const OverriddenEApiKeySchema = EApiKeySchema.omit({ user: true }).merge(
  z.object({
    user: z.string().or(z.object({})),
  }),
);
type OverriddenEApiKey = z.infer<typeof OverriddenEApiKeySchema>;

@Entity()
export class EApiKeyBackend<
  T extends string | EUserBackend = string | EUserBackend,
> implements OverriddenEApiKey
{
  @PrimaryColumn({
    nullable: false,
    unique: true,
  })
  key: string;

  @ManyToOne(() => EUserBackend, (user) => user.apikeys, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: T;

  @Column({
    nullable: false,
  })
  created: Date;

  @Column({
    nullable: true,
  })
  last_used: Date;
}
