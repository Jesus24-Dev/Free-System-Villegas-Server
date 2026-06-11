import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthDto } from './dto/auth.dto';
import { RegisterDto } from './dto/register-auth.dto';
import { PasswordService } from './dto/services/password.service';
import { TokenService } from './dto/services/token.service';
import { RegisterUserUseCase } from './use-cases/register-user.use-case';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
  ) {}

  async signIn(email: string, pass: string): Promise<AuthDto> {
    const user = await this.userService.findByEmail(email);

    const isMatch = await this.passwordService.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException(
        'La clave no coincide con el registro encontrado.',
      );
    }
    const access_token = this.tokenService.generateAccessToken(user);

    return { access_token };
  }

  async register(registerDto: RegisterDto): Promise<AuthDto> {
    const newUser = await this.registerUserUseCase.execute(registerDto);
    const access_token = this.tokenService.generateAccessToken(newUser);
    return { access_token };
  }
}
