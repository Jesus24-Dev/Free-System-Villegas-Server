import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ParseEnumCaseInsensitivePipe implements PipeTransform {
  // Le pasamos el Enum como argumento al constructor
  constructor(
    private readonly enumEntity: object,
    private readonly enumName: string,
  ) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }

    if (typeof value !== 'string') {
      throw new BadRequestException(
        `El valor para ${this.enumName} debe ser un texto.`,
      );
    }

    const formattedValue = value.toUpperCase().replace(/-/g, '_');

    // Validamos si existe en el Enum
    const isValid = Object.values(this.enumEntity).includes(formattedValue);

    if (!isValid) {
      const allowedValues = Object.values(this.enumEntity)
        .map((v: string) => v.toString().toLowerCase().replace(/_/g, '-'))
        .join(', ');

      throw new BadRequestException(
        `"${value}" no es un valor válido para ${this.enumName}. Opciones: [${allowedValues}]`,
      );
    }

    return formattedValue;
  }
}
