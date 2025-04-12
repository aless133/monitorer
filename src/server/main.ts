import express from 'express';
import ViteExpress from 'vite-express';
import { loopRun } from '@/server/loop.ts';
import { apiRouter } from '@/server/api.ts';
import { TargetSchema } from '@/types.ts';
import { errorHandler } from '@/server/error.ts';

const app = express();

app.get('/hello', (_, res) => {
  res.send('Hello Vite + Vue + TypeScript!');
});

// const s=TargetSchema.safeParse({"id":"---f81d4fae-7dec-11d0-a765-00a0c91e6bf6","source":"kufar","url":"http://google.com"});
// console.log(JSON.stringify(s.error?.errors));

app.use('/api/targets', apiRouter('targets'));
app.use('/api/history', apiRouter('history',['list','get']));
app.use(errorHandler);

// app.get('/api1/*', (_, res) => {
//   res.sendStatus(404);
// });

// app.get('/api/*', (_, res) => {
//   res.status(404).send('');
// });

// app.get('/api2/*', (_, res) => {
//   res.status(404).send();
// });


loopRun();
const loopInterval = setInterval(() => {
  loopRun();
}, 10 * 1000);

ViteExpress.listen(app, 3000, () => console.log('Server is listening on port 3000...'));
