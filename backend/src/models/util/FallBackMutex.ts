import { AsyncFailable, HasSuccess } from 'picsur-shared/dist/types';

const fallBackMap: Record<string, Promise<unknown>> = {};

export async function FallBackMutex<
  MF extends () => AsyncFailable<O>,
  FF extends () => AsyncFailable<unknown>,
  O,
>(key: string, mainFunc: MF, fallBackFunc: FF): AsyncFailable<O> {
  const try_it = await mainFunc();
  if (HasSuccess(try_it)) return try_it;

  if (fallBackMap[key] !== undefined) {
    await fallBackMap[key];
    return FallBackMutex(key, mainFunc, fallBackFunc);
  }

  fallBackMap[key] = fallBackFunc();
  fallBackMap[key]
    .then(() => {
      delete fallBackMap[key];
    })
    .catch(() => {
      delete fallBackMap[key];
    });
  return FallBackMutex(key, mainFunc, fallBackFunc);
}
