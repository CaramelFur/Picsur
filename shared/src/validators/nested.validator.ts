import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Newable } from '../types';

export const IsNested = (nestedClass: Newable<any>) => {
  const nestedValidator = ValidateNested();
  const isNotEmptyValidator = IsNotEmpty();
  const typeValidator = Type(() => nestedClass);
  
  return (target: Object, propertyKey: string | symbol): void => {
    nestedValidator(target, propertyKey);
    isNotEmptyValidator(target, propertyKey);
    typeValidator(target, propertyKey);
  };
};
