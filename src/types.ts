import { boolean, z, ZodSchema } from 'zod';
import { getSource } from './server/sources.ts';

export interface ISource {
  name: string;
  needsUrl: boolean;
  run(url?: string): Promise<TLot[]>;
}

export interface ISourceClient extends Pick<ISource, 'name' | 'needsUrl'> {}

///////////////////

const BaseTargetSchema = z.object({
  source: z.string(),
  url: z.string().url().optional(),
  active: z.boolean().default(true),
  interval: z.number().int().nonnegative(),
  last_run: z.number().int().nonnegative().optional(),
});

export const TargetSchema = BaseTargetSchema.extend({ id: z.string().uuid() });
export const TargetCreateSchema = BaseTargetSchema;

// const TargetSchemaWithUrlValidation = (schema: ZodSchema) =>
//   schema.refine((data) => !getSource(data.source)?.needsUrl || data.url, {
//     message: 'URL is required for this source type',
//     path: ['url'],
//   });

// export const TargetSchema = TargetSchemaWithUrlValidation(BaseTargetSchema.extend({ id: z.string().uuid() }));
// export const TargetCreateSchema = TargetSchemaWithUrlValidation(BaseTargetSchema);
// export type TTarget = z.infer<typeof TargetSchema>;
export type TTarget = {
  id: string;
  source: string;
  url?: string;
  active: boolean;
  interval: number;
  last_run?: number;
};

///////

export const LotCreateSchema = z.object({
  target: z.string().uuid().optional(),
  data: z.record(z.string()),
});
export const LotSchema = LotCreateSchema.extend({ id: z.string().uuid() });

export type TLot = {
  id: string;
  target?: string;
  key: string;
  data: Record<string, string>;
};

export type TLotNew = Omit<TLot, 'id'>;


//////

export const EntitySchemas = {
  targets: TargetSchema,
  lots: LotSchema,
};
export const EntityCreateSchemas = {
  targets: TargetCreateSchema,
  lots: LotCreateSchema,
};

export type EntityDataTypes = {
  targets: TTarget;
  lots: TLot;
};

export type TDatabase = {
  targets: Record<string,TTarget>;
  lots: Record<string,TLot>;
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

