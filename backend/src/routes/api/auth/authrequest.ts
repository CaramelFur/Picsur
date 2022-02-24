import { FastifyRequest } from 'fastify';
import { User } from '../../../collections/userdb/user.dto';

export default interface AuthFasityRequest extends FastifyRequest {
  user: User;
}
