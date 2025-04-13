import { boolean, z, ZodSchema } from 'zod';
import { getSource } from './server/sources.ts';

export interface ISource {
  name: string;
  needsUrl: boolean;
  run(url?: string): Promise<Omit<TLot, 'id'>[]> | Omit<TLot, 'id'>[];
}

export interface ISourceClient extends Pick<ISource, 'name' | 'needsUrl'> {}

///////////////////

const BaseTargetSchema = z.object({
  source: z.string(),
  url: z.string().url().optional(),
  active: z.boolean().default(true),
  interval: z.number().int().nonnegative(),
  last_run: z.number().int().nonnegative().optional(),
  last_update: z.number().int().nonnegative().optional(),
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
  last_update?: number;
};

///////

export const LotDataScheme = z.record(z.string());
export const LotCreateSchema = z.object({
  target: z.string().uuid().optional(),
  key: z.string(),
  data: LotDataScheme,
});
export const LotSchema = LotCreateSchema.extend({ id: z.string().uuid() });

export type TLotData = Record<string, string>;
export type TLot = {
  id: string;
  target?: string;
  key: string;
  data: TLotData;
};

export type TLotNew = Omit<TLot, 'id'>;

///////

export type TChanges = {
  added: TLotNew[];
  removed: TLot[];
  updated: Array<{
    id: string;
    key: string;
    old: TLotData;
    new: TLotData;
  }>;
};

export const ChangesSchema = z.object({
  added: z.array(LotCreateSchema),
  removed: z.array(LotSchema),
  updated: z.array(
    z.object({
      id: z.string().uuid(),
      key: z.string(),
      old: LotDataScheme,
      new: LotDataScheme,
    })
  ),
});

//////

export const HistoryCreateSchema = z.object({
  dt: z.number().int().nonnegative().optional(),
  target: z.string().uuid(),
  changes: ChangesSchema,
});

export const HistorySchema = LotCreateSchema.extend({ id: z.string().uuid() });

export type THistory = {
  id: string;
  dt: number;
  target: string;
  changes: TChanges;
};

//////

export const EntitySchemas = {
  targets: TargetSchema,
  lots: LotSchema,
  history: HistorySchema,
};
export const EntityCreateSchemas = {
  targets: TargetCreateSchema,
  lots: LotCreateSchema,
  history: HistoryCreateSchema,
};

export type EntityDataTypes = {
  targets: TTarget;
  lots: TLot;
  history: THistory;
};

export type TDatabase = {
  targets: Record<string, TTarget>;
  lots: Record<string, TLot>;
  history: Record<string, THistory>;
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
