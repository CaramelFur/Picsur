export interface FindResult<T> {
  results: T[];
  total: number;

  page: number;
  pages: number;
}
