import { Controller, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../auth/admin.guard';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('pref')
export class PrefController {
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('set/:key')
  async register(
    @Request() req: AuthFasityRequest,
    @Body() register: AuthRegisterRequest,
  ) {
    const user = await this.authService.createUser(
      register.username,
      register.password,
    );

    if (HasFailed(user)) throw new ConflictException('User already exists');

    if (register.isAdmin) {
      await this.authService.makeAdmin(user);
    }

    return user;
  }
}
