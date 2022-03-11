type FCDecorator = MethodDecorator & ClassDecorator;

export function CombineDecorators(...decorators: FCDecorator[]) {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    decorators.forEach(decorator => {
      decorator(target, key, descriptor);
    });
  }
}
