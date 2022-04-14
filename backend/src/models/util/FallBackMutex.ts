/*
This function is necessary to make sure that a default isnt generated multiple times at the same time.
Doing that will cause errors.

An example is the jwt secret value, its value is requested aroun 3 times at the same time while starting.
So when the program was started for the first time, each request returned a different secret.

This function will first try and see if its first function returns a value, if it does, it will return that value.
If not it will execute a fallback function, which usually is a function that populates a default value.
After that is done it will retry the first function again.
*/

const fallBackMap: Record<string, Promise<unknown>> = {};

export async function FallBackMutex<
  MF extends () => Promise<O | null | undefined>,
  FF extends () => Promise<unknown>,
  O,
>(key: string, mainFunc: MF, fallBackFunc: FF): Promise<O> {
  const try_it = await mainFunc();
  if (try_it !== undefined && try_it !== null) return try_it;

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
