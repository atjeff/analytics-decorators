export type DecoratorOutput<T, K> = T | ((input: K) => T);
