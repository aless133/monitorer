import 'dotenv/config';
import express from 'express';
import ViteExpress from 'vite-express';
import { getSession, authRouter } from '@/server/auth.ts';
import { apiRouter } from '@/server/api.ts';
import { errorHandler } from '@/server/error.ts';
import { loopRun } from '@/server/loop.ts';
import { loopInterval } from '@/globals.ts';
import { c } from '@/helpers.ts';
import { contextCreate, contextStorage, contextStore } from '@/server/context.ts';

const app = express();
app.use(getSession());

app.get('/hello', (_, res) => {
  res.send('Hello Vite + Vue + TypeScript!');
});

app.use('/api', (req, res, next) => {
  contextStorage.run(contextCreate(), async () => {
    c.log(req.method, req.originalUrl);
    next();
  });
});

app.use('/api', authRouter());
app.use('/api/targets', apiRouter('targets'));
app.use('/api/lots', apiRouter('lots', ['list', 'get']));
app.use('/api/history', apiRouter('history', ['list', 'get']));
app.use(errorHandler);

contextStorage.run(contextCreate(), async () => {
  await loopRun();
});

const loopInt = setInterval(async () => {
  contextStorage.run(contextCreate(), async () => {
    await loopRun();
  });
}, loopInterval);

const port = parseInt(process.env.PORT || '3000');
ViteExpress.listen(app, port, () => {
  console.log('Monitorer is listening on port ' + port + '...');
});
