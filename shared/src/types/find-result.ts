export interface FindResult<T> {
  results: T[];
  totalResults: number;

  page: number;
  pages: number;
}
