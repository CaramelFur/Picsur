// Any thing that can come after 'new'

export type Newable<T> = { new (...args: any[]): T };
