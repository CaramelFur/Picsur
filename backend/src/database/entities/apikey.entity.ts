import { EApiKey } from 'picsur-shared/dist/entities/apikey.entity';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class EApiKeyBackend implements EApiKey {
  @PrimaryColumn({
    nullable: false
  })
  key: string;

  @Column({
    nullable: false,
  })
  user_id: string;

  @Column({
    nullable: false,
  })
  created: Date;
}
