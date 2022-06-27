/*
This function is necessary to make sure that a default isn't generated multiple times at the same time.
Doing that will cause errors.

An example is the jwt secret value, it's value is requested around 3 times at the same time while starting.
So when the program was started for the first time, each request returned a different secret.

This function will try and see if its first function returns a value, if it does, it will return that value.
(A Failure object will be seen as a value, only null and undefined are counted as non-values)
If not it will execute a fallback function, which usually is a function that populates a default value.
After that is done it will retry the first function again.
*/

const fallBackMap: Record<string, Promise<unknown>> = {};

export async function MutexFallBack<
  MF extends () => Promise<O | null | undefined>,
  FF extends () => Promise<O>,
  O,
>(key: string, mainFunc: MF, fallBackFunc: FF): Promise<O> {
  const try_it = await mainFunc();
  if (try_it !== undefined && try_it !== null) return try_it;

  // Check if a fallback is already running, if so wait on that
  if (fallBackMap[key] !== undefined) {
    await fallBackMap[key];

    // When it is done, try again
    return MutexFallBack(key, mainFunc, fallBackFunc);
  }

  // No fallback is running, start one
  const fallBackPromise = fallBackFunc();

  // Save the running fallback, and make sure it is cleared when it is done
  fallBackMap[key] = fallBackPromise;
  fallBackMap[key].finally(() => {
    delete fallBackMap[key];
  });

  return fallBackPromise;
}
