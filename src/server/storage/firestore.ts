import dotenv from 'dotenv';
dotenv.config();

import { TEntity, EntityDataTypes, EntitySchemas, EntityCreateSchemas, TTarget, TLot, THistory } from '@/types.ts';
import { MonitorerError } from '@/server/error.ts';
import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
// import { getDatabase } from 'firebase-admin/database';
// import serviceAccount from '@/server/monitorer-service-account.json' with { type: 'json' };

console.trace('firebase');

function getDb() {
  console.trace('firebase getDb');

  const firebase = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Handle newline escapes
    }),
  });
  
  const database = getFirestore(firebase);

  const db = {
    async list<K extends TEntity>(entity: K, filter?: Partial<EntityDataTypes[K]>): Promise<EntityDataTypes[K][]> {
      let query: FirebaseFirestore.Query = database.collection(entity);
      if (filter && Object.keys(filter).length > 0) {
        Object.entries(filter).forEach(([key, value]) => {
          query = query.where(key, '==', value);
        });
      }
      const snapshot = await query.get();
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as EntityDataTypes[K]));
    },

    async get<K extends TEntity>(entity: K, id: string): Promise<EntityDataTypes[K]> {
      if (!id) throw new MonitorerError('get: No id', { entity, id });
      const doc = await database.collection(entity).doc(id).get();
      if (!doc.exists) throw new MonitorerError('Entity not found', { entity, id });
      return { id: doc.id, ...doc.data() } as EntityDataTypes[K];
    },

    async create<K extends TEntity>(entity: K, data: Omit<EntityDataTypes[K], 'id'>): Promise<EntityDataTypes[K]> {
      const v = EntityCreateSchemas[entity].safeParse(data);
      if (!v.success) throw new MonitorerError('Invalid Entity data', { entity, error: v.error });
      const docRef = await database.collection(entity).add(data);
      return { id: docRef.id, ...data } as EntityDataTypes[K];
    },

    async update<K extends TEntity>(
      entity: K,
      id: string,
      data: Partial<EntityDataTypes[K]>
    ): Promise<EntityDataTypes[K]> {
      if (!id) throw new MonitorerError('update: No id', { entity, id });
      const docRef = database.collection(entity).doc(id);
      const docSnap = await docRef.get();
      if (!docSnap.exists) throw new MonitorerError('Entity not found', { entity, id });
      const currentData = docSnap.data() || {};
      const { id: _, ...cleanData } = data;
      const updatedEntity = { ...currentData, ...cleanData, id };
      const v = EntitySchemas[entity].safeParse(updatedEntity);
      if (!v.success) throw new MonitorerError('Invalid Entity data', { entity, error: v.error });
      await docRef.set(updatedEntity);
      return updatedEntity as EntityDataTypes[K];
    },

    async delete(entity: TEntity, id: string) {
      if (!id) throw new MonitorerError('delete: No id', { entity, id });
      const docRef = database.collection(entity).doc(id);
      const doc = await docRef.get();
      if (!doc.exists) throw new MonitorerError('Entity not found', { entity, id });
      await docRef.delete();
      return {};
    },
  };

  return db;
}

export default getDb;
