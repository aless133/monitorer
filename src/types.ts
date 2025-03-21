import { z } from 'zod';
import { sources } from '@/globals.ts';

export const TargetSchema = z.object({
  id: z.string().uuid(),
  source: z.enum(sources),
  url: z.string().url(),
});

export type TTarget = z.infer<typeof TargetSchema>

export const EntitySchemas = {
  targets: TargetSchema,
}

export type EntityDataTypes = {
  targets: TTarget;
};

export type TDatabase = {
  [K in keyof EntityDataTypes]: Record<string, EntityDataTypes[K]>;
}

export type TEntity = keyof TDatabase;

export enum EDbErrors {
  INVALID_DATA = 1,
  NOT_FOUND = 2,
}

interface IError {
  code: number | EDbErrors;
  message: string;
}

export interface IDbReturn {
  err?: IError;
  data?: any;
}

//про запас
//export type TFnVoid = () => void;
