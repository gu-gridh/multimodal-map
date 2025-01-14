export function clean(obj) {
  const isEmpty = (x) => !x && x !== 0;
  return Object.keys(obj).reduce(
    (copy, k) => (isEmpty(obj[k]) ? copy : { ...copy, [k]: obj[k] }),
    {}
  );
}
