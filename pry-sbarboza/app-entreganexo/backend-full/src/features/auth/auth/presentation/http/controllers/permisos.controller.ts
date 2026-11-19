import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthService } from '../../../application/services/auth.service.js';
import { JwtAuthGuard } from '../../../../../../common/guards/jwt-auth.guard.js';

@ApiTags('permisos')
@Controller('permisos')
export class PermisosController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getPermissions(@Req() req: Request) {
    const user = (req as any).auth;
    return this.authService.getPermissions(user.id);
  }
}
