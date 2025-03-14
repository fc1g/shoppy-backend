import { UseInterceptors } from '@nestjs/common';
import { ClassConstructor } from 'typings/classConstructor';
import { SerializeInterceptor } from '../interceptors/serialize.interceptor';

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}
