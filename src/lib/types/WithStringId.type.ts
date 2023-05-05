// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export type WithStringId<T extends unknown> = T & {
  _id: string;
}
