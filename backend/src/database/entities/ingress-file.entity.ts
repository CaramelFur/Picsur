import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EIngressFileBackend {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  filename: string;

  @Column({ type: 'bytea', nullable: false })
  data: Buffer;

  @Column({ nullable: false, default: false })
  in_use: boolean;
}
