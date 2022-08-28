export const ParseBool = <T extends boolean | null = null>(
  value: unknown,
  fallback?: T,
): boolean | T => {
  if (value === true || value === 'true' || value === '1' || value === 'yes')
    return true;
  if (value === false || value === 'false' || value === '0' || value === 'no')
    return false;

  return fallback === undefined ? (null as T) : fallback;
};

export const ParseInt = <T extends number | null = null>(
  value: unknown,
  fallback?: T,
): number | T => {
  if (typeof value === 'number') return value;
  if (typeof value === 'boolean') return value ? 1 : 0;
  if (typeof value === 'string') {
    const parsed = parseInt(value);
    if (!isNaN(parsed)) return parsed;
  }
  return fallback === undefined ? (null as T) : fallback;
};

export const ParseString = <T extends string | null = null>(
  value: unknown,
  fallback?: T,
): string | T => {
  if (typeof value === 'string') return value;
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') return value.toString();
  return fallback === undefined ? (null as T) : fallback;
};
