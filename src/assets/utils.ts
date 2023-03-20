export function clean<T extends Record<string, any>>(obj: T): Partial<T> {
  const isEmpty = (x: any) => !x && x !== 0;
  return Object.keys(obj).reduce(
    (copy, k) => (isEmpty(obj[k]) ? copy : { ...copy, [k]: obj[k] }),
    {}
  );
}
