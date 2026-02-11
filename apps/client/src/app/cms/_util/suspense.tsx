export function SuspendIndefinitely() {
  throw new Promise(() => {});
  return null;
}
