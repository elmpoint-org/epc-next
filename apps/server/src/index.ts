import express from 'express';
import cors from 'cors';
import { expressErr } from '##/util/err.js';

import { graphHTTP } from './db/graph';
import api from './api/api';
import ics from './ics/ics';

if (process.env.IS_OFFLINE) {
  import('dotenv/config');
}

export const app = express();

// MIDDLEWARE

app.use((req, _, next) => {
  req.setEncoding('utf-8');
  next();
});

app.use(cors());
app.use(express.json());
// app.use((req, res, next) => {
//   if (
//     req.method === 'POST' &&
//     req.headers['content-type'] &&
//     req.headers['content-type'].includes('application/json')
//   ) {
//     let data = '';
//     req.setEncoding('utf8');
//     req.on('data', (chunk) => {
//       data += chunk;
//     });
//     req.on('end', () => {
//       // console.log('Raw body:', data);
//       try {
//         const parsed = JSON.parse(data);
//         // console.log('Manually parsed JSON:', parsed);
//         (req as any).body = parsed;
//       } catch (err) {
//         // console.log('Failed to parse JSON:', err);
//       }
//       next();
//     });
//   } else {
//     next();
//   }
// });
app.use(expressErr);

// ROUTES

app.get('/', async (_, res) => res.json({ data: 'hello world' }));

app.use('/gql', graphHTTP);

app.use('/api', api);

app.use('/ics', ics);

app.use((_, res) => res.err(404, 'NOT_FOUND'));
