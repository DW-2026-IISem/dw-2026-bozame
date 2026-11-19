import { Controller, Post, Get, Body, HttpCode, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthService } from '../../../application/services/auth.service.js';
import { LoginDto } from '../../../application/dto/login.dto.js';
import { JwtAuthGuard } from '../../../../../../common/guards/jwt-auth.guard.js';

@ApiTags('auth')
@Controller(['auth', 'sesion'])
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get(['perfil', 'me'])
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: Request) {
    const user = (req as any).auth;
    return this.authService.getProfile(user.id);
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(@Body() body: any) {
    return this.authService.refresh(body);
  }

  @Post('logout')
  @HttpCode(200)
  async logout() {
    return { message: 'Sesión cerrada exitosamente' };
  }
}
