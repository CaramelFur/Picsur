import { ObjectLiteral, Repository } from 'typeorm';

// This is a function that returns an array of all available columns in a database table
// It is used to fetch hidden columns from the database
export function GetCols<T extends ObjectLiteral>(
  repository: Repository<T>,
): (keyof T)[] {
  return repository.metadata.columns.map(
    (col) => col.propertyName,
  ) as (keyof T)[];
}
