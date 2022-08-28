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
  filetype: string;

  @Column({ name: 'last_read', nullable: false })
  last_read: Date;

  // Binary data
  @Column({ type: 'bytea', nullable: false })
  data: Buffer;
}
