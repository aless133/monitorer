import express from 'express';
import storage from '@/server/storage/storage.ts';
import type { TDatabase, TEntity, EntityDataTypes, IDbReturn } from '@/types.ts';
import { EDbErrors, EntitySchemas, EntityCreateSchemas } from '@/types.ts';

function storageError(res: express.Response, result: IDbReturn) {
  if (result.err) {
    res
      .status(result.err.code == EDbErrors.INVALID_DATA ? 400 : result.err.code == EDbErrors.NOT_FOUND ? 404 : 500)
      .json({ error: result.err.message });
    return true;
  }
  return false;
}

export function apiRouter(entity: TEntity, methods: string[] = ['list', 'get', 'create', 'update', 'delete']) {
  const router = express.Router();
  router.use(express.json());
  const schema = EntitySchemas[entity];
  const schemaCreate = EntityCreateSchemas[entity];

  if (methods.includes('list')) {
    router.get('/', (req, res) => {
      res.json(storage.list(entity).data);
    });
  }

  if (methods.includes('get')) {
    router.get('/:id', (req, res) => {
      const id = req.params.id;
      const result = storage.get(entity, id);
      if (!storageError(res,result))
        res.json(result.data);
    });
  }

  if (methods.includes('create')) {
    router.post('/', (req, res) => {
      const v = schemaCreate.safeParse(req.body);
      if (!v.success) {
        return res.status(400).json({ errors: v.error.errors });
      }
      const result = storage.create(entity, v.data);
      if (!storageError(res,result))
        res.status(201).json(result.data);
    });
  }

  if (methods.includes('update')) {
    router.put('/:id', (req, res) => {
      const id = req.params.id;
      const v = schema.safeParse(req.body);
      if (!v.success) {
        return res.status(400).json({ errors: v.error.errors });
      }
      const result = storage.update(entity, id, v.data);
      if (!storageError(res,result))
        res.json(result.data);
    });
  }

  if (methods.includes('delete')) {
    router.delete('/:id', (req, res) => {
      const id = req.params.id;
      const result = storage.delete(entity, id);
      if (!storageError(res,result))
        res.sendStatus(204);
    });
  }

  return router;
}
