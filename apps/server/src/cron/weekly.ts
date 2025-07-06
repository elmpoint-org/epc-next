import { purgeCMSImages, purgeCooldown } from './src/purge';

export function handler() {
  Promise.all([purgeCooldown(), purgeCMSImages()]);
}
