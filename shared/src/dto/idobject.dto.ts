import { IsEntityID } from '../validators/entity-id.validator';

export class EntityIDObject {
  @IsEntityID()
  id: string;
}
