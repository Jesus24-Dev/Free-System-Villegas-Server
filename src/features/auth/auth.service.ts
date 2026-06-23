import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { PasswordService } from './services/password.service';
import { TokenService } from './services/token.service';
import { RegisterUserUseCase } from './use-cases/register-user.use-case';
import { Prisma } from '@prisma/client';
import { RegisterDto, SignInDto } from './dto/request';
import { AuthDto } from './dto/responses';
import { LoggerService } from 'src/common/logger/logger.service';

export type UserWithPerson = Prisma.UserGetPayload<{
  include: { person: true };
}>;

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly logger: LoggerService,
  ) {}

  async signIn(dto: SignInDto): Promise<AuthDto> {
    const user = await this.userService.findByEmail(dto.email);

    const isMatch = await this.passwordService.compare(
      dto.password,
      user.password,
    );
    if (!isMatch) {
      this.logger.error('LOGIN_FAILED', new Error('Password does not match'), {
        email: dto.email,
      });

      throw new UnauthorizedException(
        'La clave no coincide con el registro encontrado.',
      );
    }
    const access_token = await this.tokenService.generateAccessToken(user);
    return { access_token };
  }

  async register(registerDto: RegisterDto): Promise<AuthDto> {
    const newUser = await this.registerUserUseCase.execute(registerDto);
    const access_token = await this.tokenService.generateAccessToken(newUser);
    return { access_token };
  }

  async profile(userId: string): Promise<UserWithPerson> {
    return this.userService.getProfile(userId);
  }
}
