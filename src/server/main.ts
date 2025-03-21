import express from 'express';
import ViteExpress from 'vite-express';
import { loopRun } from '@/server/loop.ts';

const app = express();

app.get('/hello', (_, res) => {
  res.send('Hello Vite + Vue + TypeScript!');
});

const loopInterval = setInterval(() => {
  loopRun();
}, 60*1000);

ViteExpress.listen(app, 3000, () => console.log('Server is listening on port 3000...'));
