import { TLot } from "@/types.ts";

const src = {
  name: 'partslink24',
  needsUrl: false,
  run,
};

async function run() {
  const lots: Omit<TLot, 'id'>[] = [];
  return lots;
}


export default src;
