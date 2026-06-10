import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<AuthDto> {
    const user = await this.userService.findByEmail(email);
    if (user.password !== pass) {
      throw new UnauthorizedException(
        'Los campos no coinciden con el registro almacenado.',
      );
    }
    const payload = { sub: user.id, email: user.email, role: user.role };

    return { access_token: await this.jwtService.signAsync(payload) };
  }
}
