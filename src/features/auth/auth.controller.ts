import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateAuthDto, AuthResponseDto } from './dto/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
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
}
