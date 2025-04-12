import { TLot } from "@/types.ts";

const src = {
  name: 'kufar',
  needsUrl: true,
  run,
};

async function run() {
  const lots: Omit<TLot, 'id'>[] = [];
  return lots;
}

export default src;
