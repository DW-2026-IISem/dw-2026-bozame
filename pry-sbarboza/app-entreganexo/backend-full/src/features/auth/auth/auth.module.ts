import { Module } from '@nestjs/common';
import { AuthController } from './presentation/http/controllers/auth.controller.js';
import { AuthService } from './application/services/auth.service.js';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
