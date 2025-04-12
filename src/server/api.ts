import express, { NextFunction, RequestHandler } from 'express';
import storage from '@/server/storage/storage.ts';
import type { TDatabase, TEntity, EntityDataTypes, IDbReturn } from '@/types.ts';
import { EDbErrors, EntitySchemas, EntityCreateSchemas } from '@/types.ts';
import { MonitorerError } from './error.ts';

export function apiRouter(entity: TEntity, methods: string[] = ['list', 'get', 'create', 'update', 'delete']) {
  const router = express.Router();
  router.use(express.json());
  const schema = EntitySchemas[entity];
  const schemaCreate = EntityCreateSchemas[entity];

  if (methods.includes('list')) {
    router.get('/', (req, res) => {
      const filters = req.query;
      res.json(storage.list(entity, filters));
    });
  }

  if (methods.includes('get')) {
    router.get('/:id', (req, res) => {
      const id = req.params.id;
      const result = storage.get(entity, id);
      res.json(result);
    });
  }

  if (methods.includes('create')) {
    router.post('/', (req, res) => {
      const v = schemaCreate.safeParse(req.body);
      if (!v.success) throw new MonitorerError('Parse error', v.error);
      const result = storage.create(entity, v.data);
      res.status(201).json(result);
    });
  }

  if (methods.includes('update')) {
    router.put('/:id', (req, res) => {
      const id = req.params.id;
      const v = schema.partial().safeParse(req.body);
      if (!v.success) throw new MonitorerError('Parse error', v.error);
      const result = storage.update(entity, id, v.data);
      res.json(result);
    });
  }

  if (methods.includes('delete')) {
    router.delete('/:id', (req, res) => {
      const id = req.params.id;
      storage.delete(entity, id);
      res.sendStatus(204);
    });
  }

  return router;
}
