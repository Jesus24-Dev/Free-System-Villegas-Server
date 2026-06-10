import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async signIn(email: string, pass: string): Promise<AuthDto> {
    const user = await this.userService.findByEmail(email);
    if (user.password !== pass) {
      throw new UnauthorizedException(
        'Los campos no coinciden con el registro almacenado.',
      );
    }
    const { password, ...result } = user;

    return { id: result.id, token: `token: ${result.role.join(',')}` };
  }
}
