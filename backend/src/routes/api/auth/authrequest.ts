import { FastifyRequest } from 'fastify';
import { EUser } from 'picsur-shared/dist/entities/user.entity';

export default interface AuthFasityRequest extends FastifyRequest {
  user: EUser;
}
