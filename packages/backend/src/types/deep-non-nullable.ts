export type DeepNonNullable<T> = NonNullable<{
  [K in keyof T]: T[K] extends object ? DeepNonNullable<T[K]> : NonNullable<T[K]>;
}>;
