import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ObjectSchema } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') return value;

    const { error } = this.schema.validate(value);
    if (error) {
      throw new BadRequestException({
        message: 'Bad request',
        details: error.details,
      });
    }
    return value;
  }
}
