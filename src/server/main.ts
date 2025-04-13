import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import ViteExpress from 'vite-express';
import { apiRouter } from '@/server/api.ts';
import { errorHandler } from '@/server/error.ts';
import { loopRun } from '@/server/loop.ts';
import { loopInterval } from '@/globals.ts';

const app = express();

app.get('/hello', (_, res) => {
  res.send('Hello Vite + Vue + TypeScript!');
});

// import {database } from '@/server/storage/firebase.ts';
// // console.log(database);

// const collectionRef = database.collection('target');
// const docRef = await collectionRef.add({name:123});
// console.log(docRef.id);

// const s=TargetSchema.safeParse({"id":"---f81d4fae-7dec-11d0-a765-00a0c91e6bf6","source":"kufar","url":"http://google.com"});
// console.log(JSON.stringify(s.error?.errors));

app.use('/api/targets', apiRouter('targets'));
app.use('/api/lots', apiRouter('lots', ['list', 'get']));
app.use('/api/history', apiRouter('history', ['list', 'get']));
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
const loopInt = setInterval(async () => {
  await loopRun();
}, loopInterval);

ViteExpress.listen(app, 3000, () => {
  console.log('Monitorer is listening on port 3000...');
});
