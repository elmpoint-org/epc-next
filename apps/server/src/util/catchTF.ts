/** wrap a promise and it will return true or false based on resolve/rejection */
export async function catchTF(cb: (...p: any[]) => any): Promise<boolean> {
  try {
    const out = await cb();
    return out ?? true;
  } catch (_) {
    return false;
  }
}
