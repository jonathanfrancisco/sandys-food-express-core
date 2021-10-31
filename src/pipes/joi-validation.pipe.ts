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
        code: 'INVALID_REQUEST',
        message: 'Something went wrong please check your input and try again.',
        details: error.details,
      });
    }
    return value;
  }
}
