export const Nothing = undefined;
export type Nothing = undefined;
export type Maybe<T> = T | Nothing;

export type AsyncMaybe<T> = Promise<Maybe<T>>;
