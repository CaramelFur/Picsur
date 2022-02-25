import { FastifyRequest } from 'fastify';
import { User } from 'imagur-shared/dist/dto/user.dto';

export default interface AuthFasityRequest extends FastifyRequest {
  user: User;
}
