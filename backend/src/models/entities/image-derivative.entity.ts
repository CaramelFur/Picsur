import { Column, Entity, Index, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['image_id', 'key'])
export class EImageDerivativeBackend {
  @PrimaryGeneratedColumn('uuid')
  private _id?: string;

  @Index()
  @Column({ nullable: false })
  image_id: string;

  @Index()
  @Column({ nullable: false })
  key: string;

  @Column({ nullable: false })
  mime: string;

  // Binary data
  @Column({ type: 'bytea', nullable: false })
  data: Buffer;
}
