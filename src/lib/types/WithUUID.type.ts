// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export type WithUUID<T extends unknown> = T & {
  uuid: string;
}
