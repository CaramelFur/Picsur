import { EntityID } from '../validators/entity-id.validator';

export class EntityIDObject {
  @EntityID()
  id: number;
}
