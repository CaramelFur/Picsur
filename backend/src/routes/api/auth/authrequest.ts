import { FastifyRequest } from 'fastify';
import { EUserBackend } from '../../../models/entities/user.entity';

export default interface AuthFasityRequest extends FastifyRequest {
  user: EUserBackend;
}
