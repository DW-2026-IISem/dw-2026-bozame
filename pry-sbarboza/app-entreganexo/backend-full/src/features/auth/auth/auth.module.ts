import { Module } from '@nestjs/common';
import { AuthController } from './presentation/http/controllers/auth.controller.js';
import { PermisosController } from './presentation/http/controllers/permisos.controller.js';
import { AuthService } from './application/services/auth.service.js';

@Module({
  controllers: [AuthController, PermisosController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
