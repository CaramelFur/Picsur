export class ProcessingViewMeta {
  private _tag = 'ProcessingViewMeta';

  constructor(public imageFiles: File[]) {}

  static is(value: any): value is ProcessingViewMeta {
    return (value ?? {})._tag === 'ProcessingViewMeta';
  }
}
