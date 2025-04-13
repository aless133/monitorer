import type { ISource, ISourceClient } from '@/types.ts';
import kufar from '@/server/sources/kufar.ts';
import outvin from '@/server/sources/outvin.ts';
import partslink24 from '@/server/sources/partslink24.ts';
import kursonliner from '@/server/sources/kurs-onliner.ts';
import myfinrates from '@/server/sources/myfin-rates.ts';

const registeredSources = [kufar, outvin, partslink24, kursonliner, myfinrates];

export function getSources(): ISource[] {
  return registeredSources;
}

export function getSource(name: string): ISource | undefined {
  return registeredSources.find((p) => p.name === name);
}

export function getSourcesClient(): ISourceClient[] {
  return registeredSources.map((s) => ({ name: s.name, needsUrl: s.needsUrl }));
}
