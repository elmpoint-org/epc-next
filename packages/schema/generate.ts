import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { createApplication } from 'graphql-modules';
import { printSchema } from 'graphql';

import { modules } from '@epc/server';

const OUTPUT_PATH = join(__dirname, '../../schema.graphql');

function generateSchemaSDL() {
  const app = createApplication({ modules });
  const schema = app.schema;
  const sdl = printSchema(schema);
  writeFileSync(OUTPUT_PATH, sdl);

  console.log(`✔️  SDL schema written to ${OUTPUT_PATH}`);
}

async function watchMode() {
  const chokidar = await import('chokidar');
  const watcher = chokidar.watch('../src/db/models', {
    persistent: true,
    ignoreInitial: true,
  });
  watcher.on('all', (event: string, path: string) => {
    console.log(`[watch] Detected ${event} in ${path}, regenerating schema...`);
    try {
      generateSchemaSDL();
    } catch (e) {
      console.error('Error regenerating schema:', e);
    }
  });
  console.log('Watching for changes in src/db/models...');
}

const watch = process.argv.includes('--watch');
generateSchemaSDL();
if (watch) {
  watchMode();
}
