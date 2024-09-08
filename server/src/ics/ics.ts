import express from 'express';

import { getICSWithCache, validateStayToken } from './functions';

const r = express.Router();

r.get('/:token', async (req, res) => {
  try {
    // check validation
    const validated = await validateStayToken(req.params.token);
    if (!validated) return res.err(401, 'BAD_TOKEN');

    // get/generate ical
    const cal = await getICSWithCache();
    if (!cal) return res.err(500, 'SERVER_ERROR');

    // return ical
    res.contentType('text/calendar');
    res.end(cal);
  } catch (error) {
    console.log(error);
    res.err(500, 'SERVER_ERROR');
  }
});

export default r;
