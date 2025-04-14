import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import session from 'express-session';
import ViteExpress from 'vite-express';
import { apiRouter } from '@/server/api.ts';
import { errorHandler } from '@/server/error.ts';
import { loopRun } from '@/server/loop.ts';
import { loopInterval } from '@/globals.ts';

const app = express();

if (!process.env.SESSION_SECRET) process.exit(1);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

app.use('/api', (req, res, next) => {
  if (!req.session.auth) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});

app.get('/hello', (_, res) => {
  res.send('Hello Vite + Vue + TypeScript!');
});

app.use('/api/targets', apiRouter('targets'));
app.use('/api/lots', apiRouter('lots', ['list', 'get']));
app.use('/api/history', apiRouter('history', ['list', 'get']));
app.use(errorHandler);

loopRun();
const loopInt = setInterval(async () => {
  await loopRun();
}, loopInterval);

const port = parseInt(process.env.PORT || '3000');
ViteExpress.listen(app, port, () => {
  console.log('Monitorer is listening on port ' + port + '...');
});
