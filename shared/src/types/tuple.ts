// Easily create a tuple with appropriate types

const tuple = <T extends string[]>(...args: T): T => args;

export default tuple;
