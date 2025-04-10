import { boolean, z, ZodSchema } from 'zod';
import { getSource } from './server/sources.ts';

export interface ISource {
  name: string;
  needsUrl: boolean;
  run?(params: { url?: string }): Promise<any>;
}

export interface ISourceClient extends Pick<ISource, 'name' | 'needsUrl'> {}

///////////////////

const BaseTargetSchema = z.object({
  source: z.string(),
  url: z.string().url().optional(),
  active: z.boolean().default(true),
  interval: z.number().int().nonnegative(),
  last_call: z.number().int().nonnegative().optional(),
});

const TargetSchemaWithUrlValidation = (schema: ZodSchema) =>
  schema.refine((data) => !getSource(data.source)?.needsUrl || data.url, {
    message: 'URL is required for this source type',
    path: ['url'],
  });

export const TargetSchema = TargetSchemaWithUrlValidation(BaseTargetSchema.extend({ id: z.string().uuid() }));
export const TargetCreateSchema = TargetSchemaWithUrlValidation(BaseTargetSchema);
// export type TTarget = z.infer<typeof TargetSchema>;
export type TTarget = {
  id:string,
  source:string,
  url?:string,
  active:boolean,
  interval:number,
  last_call?:number,
}


///////

export const EntitySchemas = {
  targets: TargetSchema,
};
export const EntityCreateSchemas = {
  targets: TargetCreateSchema,
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
