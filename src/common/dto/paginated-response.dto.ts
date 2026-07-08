import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponseDto<T> {
  @ApiProperty({ description: 'Datos de la página actual' })
  data: T[];

  @ApiProperty({ description: 'Página actual' })
  page: number;

  @ApiProperty({ description: 'Registros por página' })
  limit: number;

  @ApiProperty({ description: 'Total de registros' })
  total: number;

  @ApiProperty({ description: 'Total de páginas' })
  totalPages: number;

  constructor(data: T[], total: number, page: number, limit: number) {
    this.data = data;
    this.page = page;
    this.limit = limit;
    this.total = total;
    this.totalPages = Math.ceil(total / limit);
  }
}
