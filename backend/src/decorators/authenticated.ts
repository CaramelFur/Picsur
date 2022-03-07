import { CanActivate, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../managers/auth/guards/admin.guard';
import { JwtAuthGuard } from '../managers/auth/guards/jwt.guard';

export const Authenticated = (adminOnly: boolean = false) => {
  const guards: (Function | CanActivate)[] = [JwtAuthGuard];
  if (adminOnly) guards.push(AdminGuard);

  return UseGuards(...guards);
};
