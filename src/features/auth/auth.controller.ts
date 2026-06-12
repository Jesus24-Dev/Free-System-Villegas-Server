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
import { CreateAuthDto, AuthResponseDto, JwtPayload } from './dto/auth.dto';
import { ProfileDto, RegisterDto } from './dto/register-auth.dto';
import { GetUser } from './dto/decorators/get-user.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { plainToInstance } from 'class-transformer';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Inicio de sesion del usuario' })
  @ApiResponse({
    status: 200,
    description: 'Usuario inicio sesion exitosamente',
    type: AuthResponseDto,
  })
  async signIn(@Body() createAuthDto: CreateAuthDto): Promise<AuthResponseDto> {
    return this.authService.signIn(createAuthDto.email, createAuthDto.password);
  }

  @Post('register')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar nuevo usuario' })
  @ApiResponse({
    status: 200,
    description: 'Nuevo usuario registrado',
    type: AuthResponseDto,
  })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
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
    const profile = await this.authService.profile(user.sub);
    return plainToInstance(ProfileDto, profile);
  }
}
