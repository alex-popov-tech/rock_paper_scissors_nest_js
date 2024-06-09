import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/persistence/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { SigninPayload } from './types';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signin(payload: SigninPayload) {
    const user = await this.prismaService.user.findUnique({
      where: payload,
    });

    if (!user) {
      return null;
    }

    const { password: _, ...rest } = user;
    const accessToken = await this.jwtService.signAsync(rest);
    return { access_token: accessToken };
  }
}
