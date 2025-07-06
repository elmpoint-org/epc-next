import { purgeCMSImages, purgeCooldown } from './src/purge';

export async function handler() {
  await Promise.all([purgeCooldown(), purgeCMSImages()]);
}
