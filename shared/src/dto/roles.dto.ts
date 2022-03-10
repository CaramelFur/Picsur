import tuple from '../types/tuple';

// Config

const RolesTuple = tuple('user', 'admin');

// Derivatives

export const RolesList: string[] = RolesTuple;

export type Role = typeof RolesTuple[number];
export type Roles = Role[];
