import { z } from 'zod';

export const PASSKEY_PROVIDERS_URL =
  'https://raw.githubusercontent.com/passkeydeveloper/passkey-authenticator-aaguids/refs/heads/main/aaguid.json';

// quicktype version of passkey-authenticator-aaguids/aaguid.json.schema
export const PasskeyProviderSchema = z.object({
  icon_dark: z.string().optional(),
  icon_light: z.string().optional(),
  name: z.string(),
});
export type PasskeyProvider = z.infer<typeof PasskeyProviderSchema>;
export type PaskeyProviderMap = Map<string, PasskeyProvider>;
