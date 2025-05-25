import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { createApplication } from 'graphql-modules';
import { printSchema } from 'graphql';

import { modules } from '@epc/server';

const OUTPUT_PATH = join(__dirname, '../../schema.graphql');

const app = createApplication({ modules });
const schema = app.schema;
const sdl = printSchema(schema);
writeFileSync(OUTPUT_PATH, sdl);

console.log(`✔️  SDL schema written to ${OUTPUT_PATH}`);
