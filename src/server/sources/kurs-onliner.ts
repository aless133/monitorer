import { fetchHtml } from '@/server/utils.ts';
import { TLot } from '@/types.ts';

const url = 'https://kurs.onliner.by';
const src = {
  name: 'kurs.onliner.by',
  needsUrl: false,
  run,
};

async function run() {
  const { $ } = await fetchHtml(url);
  const lots: Omit<TLot, 'id'>[] = [];
  const $v = $('p.value b');
  lots.push({ key: 'USD', data: { rate: $v.eq(1).text() } });
  lots.push({ key: 'EUR', data: { rate: $v.eq(3).text() } });
  return lots;
}

export default src;
