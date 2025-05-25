import type { RequestHandler } from 'express';

export const expressErr: RequestHandler = (_, res, next) => {
  res.err = (code, error, log) => {
    res.status(code).json({ error });
    if (log) console.log(log);
  };

  next();
};
