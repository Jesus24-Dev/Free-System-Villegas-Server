import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken(user: User) {
    return this.jwtService.signAsync({
      sub: user.id,
      role: user.role,
    });
  }
}
