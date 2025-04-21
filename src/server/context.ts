import type { TContext } from '@/types.ts';
import { AsyncLocalStorage } from 'node:async_hooks';
import { randomUUID } from 'node:crypto';

export const contextStorage = new AsyncLocalStorage<TContext>();

export function contextStore() {
  const ctx = contextStorage.getStore();
  if (!ctx) throw new Error('Loop context not found. Вызов должен быть внутри loopContextStorage.run()');
  return ctx;
}

export function contextCreate() {
  const c: TContext = {
    executionId: randomUUID(),
    startTime: new Date(),
  };
  return c;
}
