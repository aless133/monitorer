import { z } from 'zod';
import { getSource } from './server/sources.ts';

export interface ISource {
  name: string;
  needsUrl: boolean;
  run?(params: { url?: string }): Promise<any>;
}

export interface ISourceClient extends Pick<ISource, 'name' | 'needsUrl'> {}

function createTargetSchema(requireId: boolean) {
  const schema = z.object({
    ...(requireId ? { id: z.string().uuid() } : {}),
    source: z.string(),
    url: z.string().url().optional(),
  });
  return schema.refine((data) => !getSource(data.source)?.needsUrl || data.url, {
    message: 'URL is required for this source type',
    path: ['url'],
  });
}
export const TargetSchema = createTargetSchema(true);
export const TargetNewSchema = createTargetSchema(false);

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
