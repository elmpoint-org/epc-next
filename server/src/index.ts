import express from 'express';
import cors from 'cors';
import { expressErr } from '@/util/err';

import { graphHTTP } from './db/graph';

if (process.env.IS_OFFLINE) {
  import('dotenv/config');
}

export const app = express();

// MIDDLEWARE

app.use(cors());
app.use(express.json());
app.use(expressErr);

// ROUTES

app.get('/', async (_, res) => res.json({ data: 'hello world' }));

app.use('/gql', graphHTTP);

app.use((_, res) => res.err(404, 'NOT_FOUND'));
