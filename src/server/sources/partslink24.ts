import type { TLot } from '@/types.ts';
import { fetchHtml } from '@/server/utils.ts';

const url = 'https://www.partslink24.com/';
const src = {
  name: 'partslink24',
  needsUrl: false,
  run,
};

async function run() {
  const { $ } = await fetchHtml(url);
  const lots: Omit<TLot, 'id'>[] = [];
  // не решна проблема редиректов
  // $('a.brand-logo').each((i, el) => {
  //   let key = $(el).attr('href')?.split('=')[1];
  //   if (key) lots.push({ key, data: { catalog: key } });
  // });
  return lots;
}

export default src;
