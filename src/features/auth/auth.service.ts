import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register-auth.dto';

const saltRounds = 10;
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<AuthDto> {
    const user = await this.userService.findByEmail(email);

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException(
        'La clave no coincide con el registro encontrado.',
      );
    }
    const payload = { sub: user.id, email: user.email, role: user.role };

    return { access_token: await this.jwtService.signAsync(payload) };
  }

  async register(registerDto: RegisterDto): Promise<AuthDto> {
    const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);

    const newUser = await this.userService.create({
      ...registerDto,
      password: hashedPassword,
    });
    const payload = { sub: newUser.id, email: newUser.email };
    const token = this.jwtService.sign(payload);
    return { access_token: token };
  }
}
