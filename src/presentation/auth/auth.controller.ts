import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { LocalGuard } from 'src/infrastructure/auth/guards';

@Controller('auth')
export class AuthController {
  @UseGuards(LocalGuard)
  @Post('signin')
  async signin(@Req() req: Request) {
    return req.user;
  }
}
