import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { plainToInstance } from 'class-transformer';
import { JwtPayload, RegisterDto, SignInDto } from './dto/request';
import { AuthDto, ProfileDto } from './dto/responses';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Inicio de sesion del usuario' })
  @ApiResponse({
    status: 200,
    description: 'Usuario inicio sesion exitosamente',
    type: AuthDto,
  })
  async signIn(@Body() dto: SignInDto): Promise<AuthDto> {
    return this.authService.signIn(dto);
  }

  @Post('register')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar nuevo usuario' })
  @ApiResponse({
    status: 200,
    description: 'Nuevo usuario registrado',
    type: AuthDto,
  })
  async register(@Body() dto: RegisterDto): Promise<AuthDto> {
    return this.authService.register(dto);
  }

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ strategy: 'excludeAll' })
  @ApiOperation({ summary: 'Obtener perfil del usuario' })
  @ApiResponse({
    status: 200,
    description: 'Perfil del usuario obtenido con exito',
    type: ProfileDto,
  })
  async profile(@GetUser() user: JwtPayload): Promise<ProfileDto> {
    const rawProfile = await this.authService.profile(user.sub);

    const profile: ProfileDto = {
      id: rawProfile.id,
      email: rawProfile.email,
      role: rawProfile.role,
      dni: rawProfile.person.dni,
      name: rawProfile.person.name,
      surname: rawProfile.person.surname,
      birthday: rawProfile.person.birthday,
      gender: rawProfile.person.gender,
      status: rawProfile.person.status,
    };

    return plainToInstance(ProfileDto, profile);
  }
}
