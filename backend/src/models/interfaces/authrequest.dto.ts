import { FastifyRequest } from 'fastify';
import { EUser } from 'picsur-shared/dist/entities/user.entity';
import { Permissions } from '../constants/permissions.const.js';

// Add typing to FastifyRequest to make using the user object easier
export default interface AuthFastifyRequest extends FastifyRequest {
  user: EUser;
  userPermissions?: Permissions;
}
