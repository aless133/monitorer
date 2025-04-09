import fs from 'fs';
import path from 'path';
import cfg from '@/../monitorer.config.ts';
import { randomUUID } from 'crypto';
import type { TDatabase, TEntity, EntityDataTypes } from '@/types.ts';
import { EDbErrors, EntitySchemas, EntityCreateSchemas } from '@/types.ts';

const database: TDatabase = {
  targets: {},
};

function parseEntityData<K extends keyof EntityDataTypes>(entity: K, data: string): Record<string, EntityDataTypes[K]> {
  return JSON.parse(data) as Record<string, EntityDataTypes[K]>;
}

function getFileName(entity: TEntity) {
  console.log(path.resolve(cfg.pathData,entity + '.json'));
  return path.resolve(cfg.pathData,entity + '.json');
}

function readData(entity: TEntity) {
  const file = getFileName(entity);
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, '{}', 'utf-8');
    database[entity] = {};
  } else {
    const data = fs.readFileSync(file, 'utf-8');
    database[entity] = parseEntityData(entity, data);
  }
}

function writeData(entity: TEntity) {
  fs.writeFileSync(getFileName(entity), JSON.stringify(database[entity]), 'utf-8');
}

for (let key in database) readData(key as TEntity);

const db = {
  list(entity: TEntity) {
    return { data: Object.keys(database[entity]).map((key) => database[entity][key]) };
  },

  get(entity: TEntity, id: string) {
    if (!id) return { err: { code: EDbErrors.INVALID_DATA, message: 'No id' } };
    if (!database[entity][id]) return { err: { code: EDbErrors.NOT_FOUND, message: 'Entity not found' } };
    return { data: database[entity][id] };
  },

  create<K extends keyof EntityDataTypes>(entity: K, data: Omit<EntityDataTypes[K], 'id'>) {
    const v = EntityCreateSchemas[entity].safeParse(data);
    if (!v.success) return { err: { code: EDbErrors.INVALID_DATA, message: 'Invalid Entity data' } };
    const id = randomUUID();
    database[entity as TEntity][id] = { ...data, id };
    writeData(entity);
    return { data: database[entity][id] };
  },

  update<K extends keyof EntityDataTypes>(entity: K, id: string, data: EntityDataTypes[K]) {
    if (!id) return { err: { code: EDbErrors.INVALID_DATA, message: 'No id' } };
    const v = EntitySchemas[entity].safeParse(data);
    if (!v.success) return { err: { code: EDbErrors.INVALID_DATA, message: 'Invalid Entity data' } };
    if (!database[entity][id]) return { err: { code: EDbErrors.NOT_FOUND, message: 'Entity not found' } };
    database[entity as TEntity][id] = { ...data, id };
    writeData(entity);
    return { data: database[entity][id] };
  },

  delete(entity: TEntity, id: string) {
    if (!id)
      return { err: { code: EDbErrors.INVALID_DATA, message: 'No id' } };
    if (!database[entity][id])
      return { err: { code: EDbErrors.NOT_FOUND, message: 'Entity not found' } };
    delete database[entity][id];
    writeData(entity);
    return {};
  },
};

export default db;
