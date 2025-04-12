import fs from 'fs';
import path from 'path';
import cfg from '@/../monitorer.config.ts';
import { randomUUID } from 'crypto';
import { TDatabase, TEntity, EntityDataTypes, EDbErrors, EntitySchemas, EntityCreateSchemas } from '@/types.ts';
import { MonitorerError } from '@/server/error.ts';

const database: TDatabase = {
  targets: {},
  lots: {},
  history: {},
};

function getFileName(entity: TEntity) {
  return path.resolve(cfg.pathData, entity + '.json');
}

function parseEntityData<K extends TEntity>(entity: K, data: string): TDatabase[K] {
  return JSON.parse(data) as TDatabase[K];
}

function readData<K extends TEntity>(entity: K) {
  const file = getFileName(entity);
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, '{}', 'utf-8');
    database[entity] = {} as TDatabase[K];
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
  list<K extends TEntity>(entity: K): EntityDataTypes[K][] {
    return Object.keys(database[entity]).map((key) => database[entity][key] as EntityDataTypes[K]);
  },

  map<K extends TEntity>(entity: K): Record<string, EntityDataTypes[K]> {
    return { ...database[entity] } as Record<string, EntityDataTypes[K]>;
  },

  get<K extends TEntity>(entity: K, id: string) {
    if (!id) throw new MonitorerError('get: No id', { entity, id });
    if (!database[entity][id]) throw new MonitorerError('Entity not found', { entity, id });
    return { ...database[entity][id] };
  },

  create<K extends TEntity>(entity: K, data: Omit<EntityDataTypes[K], 'id'>) {
    console.log(entity,data);
    const v = EntityCreateSchemas[entity].safeParse(data);
    if (!v.success) throw new MonitorerError('Invalid Entity data', { entity, error: v.error });
    const id = randomUUID();
    database[entity][id] = { ...data, id } as EntityDataTypes[K];
    writeData(entity);
    return { ...database[entity][id] };
  },

  update<K extends TEntity>(entity: K, id: string, data: Partial<EntityDataTypes[K]>) {
    if (!id) throw new MonitorerError('update: No id', { entity, id });
    const updatedEntity = { ...database[entity][id], ...data, id };
    const v = EntitySchemas[entity].safeParse(updatedEntity);
    if (!v.success) throw new MonitorerError('Invalid Entity data', { entity, error: v.error });
    if (!database[entity][id]) throw new MonitorerError('Entity not found', { entity, id });
    database[entity][id] = updatedEntity;
    writeData(entity);
    return { ...database[entity][id] };
  },

  delete(entity: TEntity, id: string) {
    if (!id) throw new MonitorerError('delete: No id', { entity, id });
    if (!database[entity][id]) throw new MonitorerError('Entity not found', { entity, id });
    delete database[entity][id];
    writeData(entity);
    return {};
  },
};

export default db;
