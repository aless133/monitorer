import { z } from 'zod';

export interface ISource {
  name: string;
  needUrl: boolean;
  run?(params: { url?: string }): Promise<any>;
}

export interface ISourceClient extends Pick<ISource, 'name' | 'needUrl'> {}

export const TargetSchema = z.object({
  id: z.string().uuid(),
  source: z.string(),
  url: z.string().url().optional(),
});

export type TTarget = z.infer<typeof TargetSchema>;

export const EntitySchemas = {
  targets: TargetSchema,
};

export type EntityDataTypes = {
  targets: TTarget;
};

export type TDatabase = {
  [K in keyof EntityDataTypes]: Record<string, EntityDataTypes[K]>;
};

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
