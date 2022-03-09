import { CanActivate, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../managers/auth/guards/admin.guard';
import { MainAuthGuard } from '../managers/auth/guards/main.guard';

export const Authenticated = (adminOnly: boolean = false) => {
  const guards: (Function | CanActivate)[] = [MainAuthGuard];
  if (adminOnly) guards.push(AdminGuard);

  return UseGuards(...guards);
};
