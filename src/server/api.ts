import express from 'express';
import getStorage from '@/server/storage/storage.ts';
import type { TEntity } from '@/types.ts';
import { EntitySchemas, EntityCreateSchemas } from '@/types.ts';
import { MonitorerError } from './error.ts';

const storage = getStorage();

export function apiRouter(entity: TEntity, methods: string[] = ['list', 'get', 'create', 'update', 'delete']) {
  const router = express.Router();
  router.use(express.json());
  const schema = EntitySchemas[entity];
  const schemaCreate = EntityCreateSchemas[entity];

  if (methods.includes('list')) {
    router.get('/', async (req, res) => {
      const filters = req.query;
      const result = await storage.list(entity, filters);
      res.json(result);
    });
  }

  if (methods.includes('get')) {
    router.get('/:id', async (req, res) => {
      const id = req.params.id;
      const result = await storage.get(entity, id);
      res.json(result);
    });
  }

  if (methods.includes('create')) {
    router.post('/', async (req, res) => {
      const v = schemaCreate.safeParse(req.body);
      if (!v.success) throw new MonitorerError('Parse error', v.error);
      const result = await storage.create(entity, v.data);
      res.status(201).json(result);
    });
  }

  if (methods.includes('update')) {
    router.put('/:id', async (req, res) => {
      const id = req.params.id;
      const v = schema.partial().safeParse(req.body);
      if (!v.success) throw new MonitorerError('Parse error', v.error);
      const result = await storage.update(entity, id, v.data);
      res.json(result);
    });
  }

  if (methods.includes('delete')) {
    router.delete('/:id', async (req, res) => {
      const id = req.params.id;
      await storage.delete(entity, id);
      res.sendStatus(204);
    });
  }

  return router;
}
