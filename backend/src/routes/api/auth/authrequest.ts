import { FastifyRequest } from 'fastify';
import { EUserBackend } from '../../../backenddto/user.entity';

export default interface AuthFasityRequest extends FastifyRequest {
  user: EUserBackend;
}
