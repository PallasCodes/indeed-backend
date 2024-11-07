import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common'

@Injectable()
export class TrimQueryPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return typeof value === 'string' ? value.trim() : value
  }
}
