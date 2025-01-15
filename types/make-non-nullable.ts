// Make a type non-nullable for specific keys
export type MakeNonNullable<T, K extends keyof T> = {
  [P in keyof T]: P extends K ? NonNullable<T[P]> : T[P];
};
