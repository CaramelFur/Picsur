import ms from 'ms';
import { z } from 'zod';

export const IsValidMS = (min = 0) =>
  z.preprocess(
    (v: any) => {
      try {
        return ms(v);
      } catch (e) {
        return NaN;
      }
    },
    z
      .number({
        errorMap: () => ({
          message: 'Invalid duration value',
        }),
      })
      .int()
      .min(min),
  );
