import { passwordlessListUsers } from '##/auth/passkeys.js';

export async function purgeRemovedUserPasskeys() {
  const { data: passkeyUsers } = await passwordlessListUsers();

  try {
    const a = passkeyUsers.values.map((it: any) => it.userId);
    console.log(a);
  } catch (error) {}
}
