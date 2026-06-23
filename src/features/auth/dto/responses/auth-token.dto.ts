import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIi...',
  })
  access_token!: string;
}
