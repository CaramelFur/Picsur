import { FastifyRequest } from 'fastify';
import { EUser } from 'picsur-shared/dist/entities/user.entity';

// Add typing to FastifyRequest to make using the user object easier
export default interface AuthFasityRequest extends FastifyRequest {
  user: EUser;
}
