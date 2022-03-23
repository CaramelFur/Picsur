
export const ComposeValidators = (...validators: PropertyDecorator[]): () => PropertyDecorator => {
  return () => {
    const decorators = [...validators];

    return (target: Object, propertyKey: string | symbol): void => {
      decorators.forEach((decorator) => decorator(target, propertyKey));
    };
  } 
};
