import express from 'express';
import { authGuard } from '@/server/auth.ts';
import { targetRunSingle } from '@/server/loop.ts';

export function targetRouter() {
  const router = express.Router();

  router.use(express.json());
  router.use(authGuard);

  router.post('/:id/run', async (req, res) => {
    const id = req.params.id;
    await targetRunSingle(id);
    res.json('dummy');
  });
  return router;
}
