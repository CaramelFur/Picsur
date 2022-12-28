import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ESystemStateBackend {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Index()
  @Column({ nullable: false, unique: true })
  key: string;

  @Column({ nullable: false })
  value: string;
}
