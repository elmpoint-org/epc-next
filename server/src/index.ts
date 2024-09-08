import express from 'express';
import cors from 'cors';
import { expressErr } from '@@/util/err';

import { graphHTTP } from './db/graph';
import api from './api/api';
import ics from './ics';

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

app.use('/api', api);

app.use('/ics', ics);

app.use((_, res) => res.err(404, 'NOT_FOUND'));
