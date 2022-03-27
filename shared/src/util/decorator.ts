type FCDecorator = MethodDecorator & ClassDecorator;

export function CombineFCDecorators(...decorators: FCDecorator[]) {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    decorators.forEach(decorator => {
      decorator(target, key, descriptor);
    });
  }
}

export const CombinePDecorators = (...decorators: PropertyDecorator[]): () => PropertyDecorator => {
  return () => {
    return (target: Object, propertyKey: string | symbol): void => {
      decorators.forEach((decorator) => decorator(target, propertyKey));
    };
  } 
};
