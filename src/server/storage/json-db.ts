import fs from 'fs';
import path from 'path';
import cfg from '@/../monitorer.config.ts';
import { randomUUID } from 'crypto';
import { TEntity, EntityDataTypes, EntitySchemas, EntityCreateSchemas, TTarget, TLot, THistory } from '@/types.ts';
import { MonitorerError } from '@/server/error.ts';

type TDatabase = {
  targets: Record<string, TTarget>;
  lots: Record<string, TLot>;
  history: Record<string, THistory>;
};
console.trace('json-db');

function getDb() {
  console.trace('json-db getDb');
  
  const database:TDatabase = {
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
      console.log('jsondb creates db',file);
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
    async list<K extends TEntity>(entity: K, filter?: Partial<EntityDataTypes[K]>): Promise<EntityDataTypes[K][]> {
      const items = Object.values(database[entity]) as EntityDataTypes[K][];
      if (!filter || Object.keys(filter).length === 0) return items;
      return items.filter((item) => {
        return Object.entries(filter).every(([key, value]) => {
          return item[key as keyof EntityDataTypes[K]] === value;
        });
      });
    },

    async get<K extends TEntity>(entity: K, id: string) {
      if (!id) throw new MonitorerError('get: No id', { entity, id });
      if (!database[entity][id]) throw new MonitorerError('Entity not found', { entity, id });
      return { ...database[entity][id] };
    },

    async create<K extends TEntity>(entity: K, data: Omit<EntityDataTypes[K], 'id'>) {
      const v = EntityCreateSchemas[entity].safeParse(data);
      if (!v.success) throw new MonitorerError('Invalid Entity data', { entity, error: v.error });
      const id = randomUUID();
      database[entity][id] = { ...data, id } as EntityDataTypes[K];
      writeData(entity);
      return { ...database[entity][id] };
    },

    async update<K extends TEntity>(entity: K, id: string, data: Partial<EntityDataTypes[K]>) {
      if (!id) throw new MonitorerError('update: No id', { entity, id });
      const updatedEntity = { ...database[entity][id], ...data, id };
      const v = EntitySchemas[entity].safeParse(updatedEntity);
      if (!v.success) throw new MonitorerError('Invalid Entity data', { entity, error: v.error });
      if (!database[entity][id]) throw new MonitorerError('Entity not found', { entity, id });
      database[entity][id] = updatedEntity;
      writeData(entity);
      return { ...database[entity][id] };
    },

    async delete(entity: TEntity, id: string) {
      if (!id) throw new MonitorerError('delete: No id', { entity, id });
      if (!database[entity][id]) throw new MonitorerError('Entity not found', { entity, id });
      delete database[entity][id];
      writeData(entity);
      return {};
    },
  };
  return db;
}

export default getDb;
