import { AsyncFailable, Fail, FT } from 'picsur-shared/dist/types';

export async function GetNextAsync<T>(
  iterator: AsyncIterableIterator<T>,
): AsyncFailable<T> {
  const { done, value } = await iterator.next();
  if (done) return Fail(FT.BadRequest);
  return value;
}
