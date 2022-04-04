import { EImageSchema } from 'picsur-shared/dist/entities/image.entity';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { z } from 'zod';

const OverriddenEImageSchema = EImageSchema.omit({ data: true }).merge(
  z.object({
    data: z.any(),
  }),
);
type OverriddenEImage = z.infer<typeof OverriddenEImageSchema>;

@Entity()
export class EImageBackend implements OverriddenEImage {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Index()
  @Column({ unique: true, nullable: false })
  hash: string;

  @Column({ nullable: false })
  mime: string;

  // Binary data
  @Column({ type: 'bytea', nullable: false, select: false })
  data?: Buffer;
}
