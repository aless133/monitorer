import { z, ZodSchema } from 'zod';

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

export const TargetSchema = BaseTargetSchema.extend({ id: z.string() });
export const TargetCreateSchema = BaseTargetSchema;

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
  target: z.string().optional(),
  key: z.string(),
  data: LotDataScheme,
});
export const LotSchema = LotCreateSchema.extend({ id: z.string() });

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
      id: z.string(),
      key: z.string(),
      old: LotDataScheme,
      new: LotDataScheme,
    })
  ),
});

//////

export const HistoryCreateSchema = z.object({
  dt: z.number().int().nonnegative().optional(),
  target: z.string(),
  changes: ChangesSchema,
});

export const HistorySchema = LotCreateSchema.extend({ id: z.string() });

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

export type TEntity = keyof EntityDataTypes;
